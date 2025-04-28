import { TosterMessages } from "@/types/enum";
import md5 from "md5";
import { toast } from "sonner";

export const profile = {
  "success": true,
  "message": "User authenticated successfully",
  "user": {
    "id": 1,
    "created_at": "2024-12-17T15:01:02.000Z",
    "updated_at": "2024-12-21T12:57:19.000Z",
    "name": "Admin",
    "subject_details": "1,2",
    "email": "admin@gmail.com",
    "mobile_number": "919087042336",
    "publish_password": "f19b8dc2029cf707939e886e4b164681",
    "other_details": "",
    "image_url": "",
    "otp": 660552,
    "otp_expired_at": "2024-12-21T07:32:19.000Z",
    "is_mobile_verified": 1,
    "token_updated_at": null,
    "token_expiry_at": null,
    "is_blocked": 0,
    "role": 2,
    "is_deleted": 0,
    "roles": {
      "id": 2,
      "created_date": "2024-12-14T19:01:56.000Z",
      "updated_date": "2024-12-14T19:01:56.000Z",
      "role": "admin",
      "name": "Admin",
      "image_file": "",
      "is_deleted": 0,
      "is_active": 1
    }
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblR5cGUiOiJCZWFyZXIiLCJpZCI6MSwidXNlck5hbWUiOiJBZG1pbiIsIm1vYmlsZU51bWJlciI6IjkxOTA4NzA0MjMzNiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczNDc2NjA5NCwiZXhwIjoxNzM0NzY5Njk0fQ.NkaJf7_Fy1-DZzTf_gkQQ9iILJMYbNu3vS79eBu8Egc"
}


export const passwordConfirm = async (enteredPassword: string, onSuccess: () => void, onFailure: () => void) => {
  try {
    // Compare the hashed password
    if (profile.user.publish_password === md5(enteredPassword)) {
      onSuccess(); // Execute the success callback (e.g., show modal)
    } else {
      toast.error(TosterMessages.ADMIN_PASSWORD_ERROR);
      onFailure(); // Execute the failure callback (e.g., reset UI state)
    }
  } catch (error) {
    toast.error(TosterMessages.ADMIN_SUB_DELETE_FAIL);
    onFailure(); // Execute failure callback in case of error
  }
};