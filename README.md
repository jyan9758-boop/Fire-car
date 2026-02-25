# Fire-car
Basic smart car project based on STM32 and Orange Pi 5.

## Web Control Panel

A Flask-based web interface with user login is included so the car can be controlled securely from a browser running on the Orange Pi 5.

### Setup

```bash
pip install -r requirements.txt
python app.py
```

Then open `http://<orange-pi-ip>:5000` in your browser.

Default credentials: **admin** / **password** (change these before deployment).
