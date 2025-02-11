<?php

header("Content-Type: application/json");

// Abilita CORS per tutte le origini
header("Access-Control-Allow-Origin: https://littlebillies.replit.app");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Gestisce le richieste OPTIONS (preflight request)
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// Recupera la API Key da variabile d'ambiente
$recaptchaSecret = getenv("RECAPTCHA_SECRET");;
$api_key = getenv("BREVO_API_KEY");
$LIST_ID = 3;  // ID della lista su Brevo

// Funzione per aggiungere un contatto a Brevo
function add_contact($email, $first_name = null) {
    global $api_key, $LIST_ID;

    if (!$api_key) {
        echo json_encode(["success" => false, "error" => "No API key provided."]);
        http_response_code(400);
        exit;
    }

    $url = "https://api.brevo.com/v3/contacts";

    $headers = [
        "Accept: application/json",
        "Content-Type: application/json",
        "api-key: $api_key"
    ];

    $data = [
        "email" => $email,
        "listIds" => [$LIST_ID],
        "updateEnabled" => true
    ];

    if ($first_name) {
        $data["attributes"] = ["FIRSTNAME" => $first_name];
    }

    $options = [
        "http" => [
            "header" => implode("\r\n", $headers),
            "method" => "POST",
            "content" => json_encode($data)
        ]
    ];

    $context = stream_context_create($options);
    $response = file_get_contents($url, false, $context);

    if ($response === false) {
        echo json_encode(["success" => false, "error" => "Failed to reach Brevo API."]);
        http_response_code(500);
        exit;
    }

    $http_code = $http_response_header[0] ?? "";
    if (strpos($http_code, "201") !== false) {
        echo json_encode(["success" => true, "message" => "Contact $email added successfully."]);
        http_response_code(201);
    } else {
        echo json_encode(["success" => false, "error" => $response]);
        http_response_code(400);
    }
}

// Gestire la richiesta POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $input_data = json_decode(file_get_contents("php://input"), true);

    $email = $input_data["email"] ?? null;
    $first_name = $input_data["name"] ?? null;

    if (!$email) {
        echo json_encode(["success" => false, "error" => "Email is required."]);
        http_response_code(400);
        exit;
    }

    // Verifica se il token reCAPTCHA è presente
    $recaptchaToken = $input_data["recaptcha_token"] ?? null;
    if (!$recaptchaToken) {
        echo json_encode(["success" => false, "error" => "Verifica CAPTCHA mancante."]);
        exit;
    }
    
    // Verifica il token reCAPTCHA con Google
    $recaptchaUrl = "https://www.google.com/recaptcha/api/siteverify";
    $response = file_get_contents($recaptchaUrl . "?secret=" . $recaptchaSecret . "&response=" . $recaptchaToken);
    $responseKeys = json_decode($response, true);

    // Controlla il punteggio reCAPTCHA (consigliato > 0.5)
    if (!$responseKeys["success"] || $responseKeys["score"] < 0.5) {
        echo json_encode(["success" => false, "error" => $responseKeys]);
        exit;
    }

    add_contact($email, $first_name);
} else {
    echo json_encode(["success" => false, "error" => "Invalid request method."]);
    http_response_code(405);
    exit;
}

?>
