{ pkgs }: {
  deps = [
    # pkgs.python310  # Usa Python 3.10
    # pkgs.python310Packages.pip  # Corretto: pip dentro python310Packages
    pkgs.php
  ];
}
