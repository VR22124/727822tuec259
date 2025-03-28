import axios from 'axios';
import React, { useEffect, useState } from 'react';

const TopUsers = () => {
    const [topUsers, setTopUsers] = useState([]);

    useEffect(() => {
        const fetchTopUsers = async () => {
            try {
                const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzMTUzNDEzLCJpYXQiOjE3NDMxNTMxMTMsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjZhOWFhMzNiLWI3NmQtNDYyYi05ZTBjLWQ4YTdhNWJjMDAwYyIsInN1YiI6IjcyNzgyMnR1ZWMyNTlAc2tjdC5lZHUuaW4ifSwiY29tcGFueU5hbWUiOiJTcmkgS3Jpc2huYSBDb2xsZWdlIG9mIFRlY2hub2xvZ3kiLCJjbGllbnRJRCI6IjZhOWFhMzNiLWI3NmQtNDYyYi05ZTBjLWQ4YTdhNWJjMDAwYyIsImNsaWVudFNlY3JldCI6InZYakdtQUR5QVRvd1pZdGQiLCJvd25lck5hbWUiOiJWaXNobnUgUm9oaXRoIEIiLCJvd25lckVtYWlsIjoiNzI3ODIydHVlYzI1OUBza2N0LmVkdS5pbiIsInJvbGxObyI6IjcyNzgyMnR1ZWMyNTkifQ.vGZ9Z2LjWiBOl9qjB0rUn5jtVymCMzWvzQHzRW6N3WY'; 
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                };

                const usersResponse = await axios.get('http://20.244.56.144/test/users', config);
                const usersData = usersResponse.data.users;

                // Fetch posts for each user and calculate post counts
                const usersWithCounts = await Promise.all(
                    Object.entries(usersData).map(async ([userId, userName]) => {
                        const postsResponse = await axios.get(
                            `http://20.244.56.144/test/users/${userId}/posts`,
                            config
                        );
                        const postCount = postsResponse.data.posts.length;
                        return { id: userId, name: userName, postCount };
                    })
                );

                // Sort users by post count in descending order and get the top 5
                const sortedTopUsers = usersWithCounts.sort((a, b) => b.postCount - a.postCount);
                const top5Users = sortedTopUsers.slice(0, 5);

                setTopUsers(top5Users);
            } catch (error) {
                console.error('Error fetching top users:', error);
            }
        };

        fetchTopUsers();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Top 5 Users by Post Count
                </h1>
                <ul className="space-y-4">
                    {topUsers.map((user) => (
                        <li
                            key={user.id}
                            className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm hover:bg-gray-100 transition"
                        >
                            <div>
                                <p className="text-lg font-medium text-gray-700">
                                    {user.name}
                                </p>
                                <p className="text-sm text-gray-500">ID: {user.id}</p>
                            </div>
                            <span className="text-sm font-semibold text-gray-600">
                                {user.postCount} Posts
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TopUsers;