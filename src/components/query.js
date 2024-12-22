import React, { useState, useEffect } from 'react';
import { postRequestUnAuthenticated } from './../services/rest';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

const QueryPage = () => {
    const [queries, setQueries] = useState([]); // State to store all queries
    const [newQuery, setNewQuery] = useState(''); // State to store the new query input
    const myData = useSelector(state => state.myData);
    const [email,setEmail] = useState("reach@chips.social");
    const [email2,setEmail2] = useState();

    useEffect(() => {
        fetchQueries();
    }, []);

    const fetchQueries = async () => {
        try {
            const response = await postRequestUnAuthenticated(`/fetch/query`); 
            setQueries(response.query);
        } catch (error) {
            console.error('Error fetching queries:', error);
        }
    };

    const handleDeleteQuery=async(id)=>{
        try {
            const response = await postRequestUnAuthenticated(`/delete/query`,{id:id}); 
            setQueries(response.query);
        } catch (error) {
            console.error('Error fetching queries:', error);
        }
    }


    const handlePostQuery = async () => {
        if (newQuery.trim() === '') return;

        try {
            const response = await postRequestUnAuthenticated(`/post/query`,{query:newQuery}); 
            if (response.success) {
                setNewQuery(''); 
                fetchQueries();
            } else {
                console.error('Failed to post query:', response.statusText);
            }
        } catch (error) {
            console.error('Error posting query:', error);
        }
    };
    const handleChangeForm = async () => {
        if (email.trim() === '' || email2.trim() === ''){
            alert("enter both emails");
        }
        try {
            const response = await postRequestUnAuthenticated(`/change/email/access`,{email:email2}); 
            if (response.success) {
                setEmail2('');
                alert("Success")
            } else {
                console.error('Failed to change email:', response.message);
                alert('Failed to change email.');
            }
        } catch (error) {
            console.error('Failed to change email:', error);
            alert('Failed to change email.');
        }
    };

    const onChange=(e)=>{
        setEmail(e.target.value);
    }
    const onChange2=(e)=>{
        setEmail2(e.target.value);
    }

    return (
        <div className="flex flex-col justify-center items-center w-full">
            {/* <h1 className="text-white mb-4">Post a Query</h1>
            <textarea
                value={newQuery}
                onChange={(e) => setNewQuery(e.target.value)}
                placeholder="Type your query here..."
                rows="5"
                style={{ width: '40%', padding: '10px', marginBottom: '10px', fontSize: '16px' }}
            />
            <button className={`w-36 py-2.5 mt-5 rounded-full flex justify-center bg-primary text-buttonText  font-normal`} onClick={handlePostQuery}>Post</button>
            
            <h2 className="text-white mb-4 mt-4">All Queries</h2>
            <div style={{ marginTop: '20px' }} className="w-full">
                {queries?.length === 0 ? (
                    <p>No queries posted yet.</p>
                ) : (
                    <ul>
                        {queries?.map((query, index) => (
                            <div className="flex flex-row space-x-5 mt-2 justify-center items-center w-full">
                                 <li key={index} className="text-white font-normal w-3/5">
                                {query.query}
                            </li>
                            <FontAwesomeIcon 
                                    icon={faTrashAlt} 
                                    onClick={() => handleDeleteQuery(query._id)} 
                                    className="text-red-500 cursor-pointer"
                                />

                            </div>
                           
                        ))}
                    </ul>
                )}
            </div> */}
            <h1 className="text-white text-xl mb-4 mt-4">Shift access of email</h1>
            <div className="flex flex-row space-x-6 mt-4">
            <input
                    type="email"
                    value={email}
                    onChange={onChange}
                    readOnly={true}
                    className=" pt-2 pb-3 pl-4 pr-3  rounded-md border font-light font-inter border-profileBorder bg-borderColor text-profileText focus:border-primary focus:ring-0 focus:outline-none"
                    placeholder="Enter sending email"
                />
                <input
                    type="email"
                    value={email2}
                    onChange={onChange2}
                    className=" pt-2 pb-3 pl-4 pr-3  rounded-md border font-light font-inter border-profileBorder bg-borderColor text-profileText focus:border-primary focus:ring-0 focus:outline-none"
                    placeholder="Enter receiving email"
                />
            </div>
            <button className={`w-36 py-2.5 mt-5 rounded-full flex justify-center bg-primary text-buttonText  font-normal`} onClick={handleChangeForm}>Change</button>

        </div>
    );
};

export default QueryPage;
