const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"; // Change to your Flask backend URL

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterData = {
  name: string;
  email: string;
  password: string;
};

export type ProfileFormData = {
  name: string;
  email: string;
  age_group: string;
  current_role: string;
  industry: string;
  experience: string;
  career_goal: string;
  new_career: string;
  career_switch: string;
  skills: string[];
  learning_style: string;
  time_commitment: string;
  budget: string;
};

export type ResumeUploadData = {
  pdf_file: File;
  goal: string;
};

const handleApiError = (response: Response) => {
  if (!response.ok) {
    return response.json().then(err => {
      throw new Error(err.error || 'Something went wrong');
    });
  }
  return response.json();
};

// Authentication functions
export const register = async (data: RegisterData): Promise<any> => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    body: formData,
  });
  
  return handleApiError(response);
};

export const login = async (credentials: LoginCredentials): Promise<any> => {
  const formData = new FormData();
  Object.entries(credentials).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    body: formData,
  });
  
  return handleApiError(response);
};

export const logout = async (): Promise<any> => {
  const response = await fetch(`${API_URL}/logout`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  
  return handleApiError(response);
};

export const getUserProfile = async (): Promise<any> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const response = await fetch(`${API_URL}/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return handleApiError(response);
};

// Prediction and profile functions
export const submitProfile = async (data: ProfileFormData): Promise<any> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'skills' && Array.isArray(value)) {
      value.forEach(skill => {
        formData.append('skills', skill);
      });
    } else {
      formData.append(key, value as string);
    }
  });

  const response = await fetch(`${API_URL}/predict`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  
  return handleApiError(response);
};

export const uploadResume = async (data: ResumeUploadData): Promise<any> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const formData = new FormData();
  formData.append('pdf_file', data.pdf_file);
  formData.append('goal', data.goal);

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  
  return handleApiError(response);
};
