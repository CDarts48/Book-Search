import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ME } from './queries';
import LoadingSpinner from './LoadingSpinner'; // hypothetical loading spinner component
import BookDetails from './BookDetails'; // hypothetical book details component

const UserDetails = () => {
    const { loading, error, data } = useQuery(GET_ME);

    if (loading) return <LoadingSpinner />;
    if (error) return <p>Error! {error.message}</p>;

    return (
        <div>
            <h2>User Details:</h2>
            <p>Username: {data.me.username}</p>
            <p>Email: {data.me.email}</p>
            <h3>Saved Books:</h3>
            {data.me.savedBooks.map((book) => (
                <BookDetails key={book.bookId} book={book} />
            )
            )}
        </div>
    );
};

export default UserDetails;