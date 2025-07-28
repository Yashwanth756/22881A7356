import React, { useRef, useState } from 'react';

export default function App() {
  const longUrl = useRef('');
  const validity = useRef('');
  const custom = useRef('');

  const [shortUrl, setShortUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({
        longUrl: longUrl.current.value,
        customCode: custom.current.value,
        validityMinutes: validity.current.value || undefined,
      })
    const res = await fetch('http://localhost:5000/api/url/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        longUrl: longUrl.current.value,
        customCode: custom.current.value,
        validityMinutes: validity.current.value || undefined,
      }),
    });
    
      const data = await res.json();
      const {error} = data;
      if(error){
        setShortUrl(error)
      }
      else
      setShortUrl(data.shortUrl); 
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 rounded-md">
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md w-full max-w-md">
        <input ref={longUrl} className="w-full outline-1 outline-gray-300 rounded-md border p-2" placeholder="Enter Long URL" required />
        <input ref={custom} className="w-full outline-1 outline-gray-300 rounded-md border p-2" placeholder="Custom Code (optional)" />
        <input ref={validity} className="w-full outline-1 outline-gray-300 rounded-md border p-2" placeholder="Validity in minutes (default 30)" type="number" />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">Shorten</button>

        {shortUrl && (
          <p>
            Short URL:{' '}
            <a className="text-blue-600" href={shortUrl} target='_blank'  rel="noopener noreferrer">
              {shortUrl}
            </a>
          </p>
        )}
      </form>
    </div>
  );
}
