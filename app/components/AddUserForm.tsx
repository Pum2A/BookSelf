import { useState } from "react";

const AddUserForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  interface NewUser {
    name: string;
    email: string;
  }

  const addUser = async (user: { name: string; email: string }) => {
    // Tymczasowa symulacja działania funkcji
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Dodano użytkownika:", user);
        resolve(user); // Zwraca użytkownika po 1 sekundzie
      }, 1000);
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newUser: NewUser = { name: name, email: email };

    try {
      const user = await addUser(newUser);
      console.log("User added:", user);
      // Możesz dodać logikę, aby np. zresetować formularz lub przekierować użytkownika
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <button type="submit">Add User</button>
    </form>
  );
};

export default AddUserForm;
