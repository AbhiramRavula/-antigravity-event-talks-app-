import sys
import os
import google.auth
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload

def upload_file_to_drive(filename, mime_type):
    """Uploads a file to Google Drive.
    
    Uses application default credentials loaded from the environment.
    For OAuth details, see: https://developers.google.com/identity
    """
    if not os.path.exists(filename):
        print(f"Error: Local file '{filename}' not found.")
        return None
        
    print(f"Authenticating and preparing to upload '{filename}'...")
    
    # Load pre-authorized user credentials from the environment
    creds, _ = google.auth.default()

    try:
        # Create Drive API client (v3)
        service = build("drive", "v3", credentials=creds)

        file_metadata = {"name": os.path.basename(filename)}
        media = MediaFileUpload(filename, mimetype=mime_type, resumable=True)
        
        print("Uploading file to Google Drive...")
        file = (
            service.files()
            .create(body=file_metadata, media_body=media, fields="id")
            .execute()
        )
        
        file_id = file.get("id")
        print(f"Successfully uploaded! File ID: {file_id}")
        return file_id

    except HttpError as error:
        print(f"An API error occurred: {error}")
        return None

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python upload_to_drive.py <file_path> <mime_type>")
        print("Example: python upload_to_drive.py photo.jpg image/jpeg")
    else:
        file_path = sys.argv[1]
        mimetype = sys.argv[2]
        upload_file_to_drive(file_path, mimetype)
