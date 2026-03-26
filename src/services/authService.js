// Mock user adatbázis (normális esetben ez a backend-en lenne)
const MOCK_USERS = [
  {
    id: 1,
    name: "Valaki Az",
    email: "valami@gmail.com",
    password: "password123",

  },

];

// Simulált késleltetés (
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Login függvény 
export const login = async (email, password) => {
  await delay(800); 

 
  const user = MOCK_USERS.find((u) => u.email === email);

  
  if (!user) {
    throw new Error("Hibás email vagy jelszó");
  }

  
  if (user.password !== password) {
    throw new Error("Hibás email vagy jelszó");
  }

  
  const token = `mock-token-${user.id}-${Date.now()}`;

  
  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token: token,
  };
};


export const register = async (name, email, password) => {
  await delay(800); 

  
  const existingUser = MOCK_USERS.find((u) => u.email === email);

  if (existingUser) {
    throw new Error("Ez az email cím már használatban van");
  }

  // Új user létrehozása
  const newUser = {
    id: MOCK_USERS.length + 1,
    name,
    email,
    password,

  };

  
  MOCK_USERS.push(newUser);

  return {
    success: true,
    message: "Sikeres regisztráció! Most már bejelentkezhetsz.",
  };
};


export const getUserByToken = async (token) => {
  await delay(500);

  
  const userId = parseInt(token.split("-")[2]);

  const user = MOCK_USERS.find((u) => u.id === userId);

  if (!user) {
    throw new Error("Érvénytelen token");
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};


export const logout = async () => {
  await delay(300);
  
  return { success: true };
};