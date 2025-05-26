import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEmails } from '../../actions/userActions'; // adjust path as needed

const AllEmailsTable = () => {
    const dispatch = useDispatch();

    const { loading, emails, error } = useSelector((state) => state.authState);

    useEffect(() => {
        dispatch(getAllEmails());
    }, [dispatch]);

    if (loading) return <p>Loading emails...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">All Emails</h2>

            {emails && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* User Emails */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">User Emails</h3>
                        <table className="table-auto w-full border">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 border">#</th>
                                    <th className="p-2 border">Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {emails.userEmails?.map((email, index) => (
                                    <tr key={index}>
                                        <td className="p-2 border">{index + 1}</td>
                                        <td className="p-2 border">{email}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Business Emails */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Business Emails</h3>
                        <table className="table-auto w-full border">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 border">#</th>
                                    <th className="p-2 border">Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {emails.businessEmails?.map((email, index) => (
                                    <tr key={index}>
                                        <td className="p-2 border">{index + 1}</td>
                                        <td className="p-2 border">{email}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Subscriber Emails */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Subscriber Emails</h3>
                        <table className="table-auto w-full border">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 border">#</th>
                                    <th className="p-2 border">Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {emails.subscriberEmails?.map((email, index) => (
                                    <tr key={index}>
                                        <td className="p-2 border">{index + 1}</td>
                                        <td className="p-2 border">{email}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllEmailsTable;
