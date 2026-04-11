import type { FormDataKeys } from "../types/editProfileResponse";

const appendToFormData = (formData: FormData, key: FormDataKeys, value: string | File) => {
    formData.append(key, value);
}

export default appendToFormData;