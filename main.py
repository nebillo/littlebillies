import os
import requests
import argparse
from flask import Flask, request, jsonify

app = Flask(__name__)

# Global API Key (to be set at runtime)
api_key = None

# Brevo API list ID
LIST_ID = 3  # Newsletter

def add_contact(email, first_name=None):
    """Adds a new contact to the Brevo list via API with an optional first name."""
    global api_key  # Ensures we're using the correct global variable

    # Use the provided API key or fallback to environment variable
    if not api_key:
        api_key = os.getenv("BREVO_API_KEY")

    if not api_key:
        return {"success": False, "error": "No API key provided."}, 400

    url = "https://api.brevo.com/v3/contacts"
    
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": api_key
    }
    
    # Base payload
    data = {
        "email": email,
        "listIds": [LIST_ID],
        "updateEnabled": True
    }
    
    # Add name only if provided
    if first_name:
        data["attributes"] = {"FIRSTNAME": first_name}

    # Make API request
    response = requests.post(url, json=data, headers=headers)
    
    if response.status_code == 201:
        return {"success": True, "message": f"Contact {email} added successfully."}, 201
    else:
        return {"success": False, "error": response.text}, response.status_code

@app.route("/subscribe", methods=["POST"])
def subscribe():
    """Handles incoming POST requests to add a new contact."""
    try:
        data = request.get_json()
        email = data.get("email")
        first_name = data.get("name")  # Optional

        if not email:
            return jsonify({"success": False, "error": "Email is required."}), 400

        # Call function to add contact
        response, status_code = add_contact(email, first_name)
        return jsonify(response), status_code

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--api-key", help="Optional API key (if not set in environment)", default=None)
    args = parser.parse_args()

    # Set API key globally (if provided via CLI)
    if args.api_key:
        api_key = args.api_key
    else:
        api_key = os.getenv("BREVO_API_KEY")

    if not api_key:
        print("⚠️ Warning: No API key set. Provide via --api-key or set BREVO_API_KEY in environment.")
    
    app.run(host="0.0.0.0", port=8080, debug=True)  # Running on port 8080
