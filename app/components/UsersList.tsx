import { useState, useEffect } from "react";
import { getUsers } from "@/services/users";
interface User {
  Id: number;
  Name: string;
  Email: string;
}

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Users List</h1>
      <ul>
        {users.map((user) => (
          <li key={user.Id}>
            {user.Name} - {user.Email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
