'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart } from "./Chart";
import Image from 'next/image';

// Component for rendering folder tree and handling click to show files
const MyProject = () => {
  
  const [tree, setTree] = useState<any>(null);
  const [totalSize, setTotalSize] = useState(0);
  const [error, setError] = useState('');
  const [currentFolder, setCurrentFolder] = useState<any>(null); // State to hold folder data for popup

  useEffect(()=>{
    const fetchFolderTree = async () => {
      try {
        setError('');
        setTree(null); // Clear previous data
  
        const response = await axios.post('/api/file/FileList', {
          bucketName:'codejam',
          folderPrefix :'code',
        });
  
        if (response.data.success) {
          setTree(response.data.tree);
          setTotalSize(response.data.totalSize);
        } else {
          setError(response.data.message || 'Failed to fetch folder tree.');
        }
      } catch (err) {
        console.error('Error fetching folder tree:', err);
        setError(err.response?.data?.error || 'An unexpected error occurred.');
      }
    };
    fetchFolderTree();
  },[])
 
  

  return (
    <div className="p-8">
      <section>
        <Chart used={totalSize} />
      </section>

      <section className="mt-8">
       <Image
       src={'/projectfile.jpg'}
       width={30}
       height={30}
       alt='file'
       />
      </section>


    </div>
  );
};

export default MyProject;
