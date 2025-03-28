import axios from 'axios';
import React, { useEffect, useState } from 'react';

const TopPosts = () => {
    const [topPosts, setTopPosts] = useState([]);

    useEffect(() => {
        const fetchTopPosts = async () => {
            try {
                const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzMTUzNDEzLCJpYXQiOjE3NDMxNTMxMTMsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjZhOWFhMzNiLWI3NmQtNDYyYi05ZTBjLWQ4YTdhNWJjMDAwYyIsInN1YiI6IjcyNzgyMnR1ZWMyNTlAc2tjdC5lZHUuaW4ifSwiY29tcGFueU5hbWUiOiJTcmkgS3Jpc2huYSBDb2xsZWdlIG9mIFRlY2hub2xvZ3kiLCJjbGllbnRJRCI6IjZhOWFhMzNiLWI3NmQtNDYyYi05ZTBjLWQ4YTdhNWJjMDAwYyIsImNsaWVudFNlY3JldCI6InZYakdtQUR5QVRvd1pZdGQiLCJvd25lck5hbWUiOiJWaXNobnUgUm9oaXRoIEIiLCJvd25lckVtYWlsIjoiNzI3ODIydHVlYzI1OUBza2N0LmVkdS5pbiIsInJvbGxObyI6IjcyNzgyMnR1ZWMyNTkifQ.vGZ9Z2LjWiBOl9qjB0rUn5jtVymCMzWvzQHzRW6N3WY'; 
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                // Fetch all users
                const usersResponse = await axios.get('http://20.244.56.144/test/users', config);
                const usersData = usersResponse.data.users;

               
                const allPosts = [];
                for (const userId of Object.keys(usersData)) {
                    const postsResponse = await axios.get(
                        `http://20.244.56.144/test/users/${userId}/posts`,
                        config
                    );
                    allPosts.push(...postsResponse.data.posts);
                }

                
                const postsWithCommentCounts = await Promise.all(
                    allPosts.map(async (post) => {
                        const commentsResponse = await axios.get(
                            `http://20.244.56.144/test/posts/${post.id}/comments`,
                            config
                        );
                        const commentCount = commentsResponse.data.comments.length;
                        return { ...post, commentCount };
                    })
                );

                
                const sortedTopPosts = postsWithCommentCounts.sort(
                    (a, b) => b.commentCount - a.commentCount
                );
                const top5Posts = sortedTopPosts.slice(0, 5);

                setTopPosts(top5Posts);
            } catch (error) {
                console.error('Error fetching posts or comments:', error);
            }
        };

        fetchTopPosts();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Top 5 Posts by Comment Count
                </h1>
                <ul className="space-y-4">
                    {topPosts.map((post) => (
                        <li
                            key={post.id}
                            className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm hover:bg-gray-100 transition"
                        >
                            <div>
                                <p className="text-lg font-medium text-gray-700">
                                    Post ID: {post.id}
                                </p>
                                <p className="text-sm text-gray-500">Content: {post.content}</p>
                            </div>
                            <span className="text-sm font-semibold text-gray-600">
                                {post.commentCount} Comments
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TopPosts;