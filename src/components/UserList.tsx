import React from "react";

interface UserListProps {
  users: { id: number; name: string }[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
  const defaultUsers = [{ id: 1, name: "John Doe" }, { id: 2, name: "Jane Doe" }];

  return (
    <div>
        {defaultUsers.map((user: { id: React.Key | null | undefined; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) => (
            <div key={user.id}>{user.name}</div>
        ))}
    </div>
);
};

export default UserList;
