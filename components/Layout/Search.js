import React, { useState } from 'react';
import { List, Image, Search } from 'semantic-ui-react';
import axios from 'axios';
import cookie from 'js-cookie';
import Router from 'next/router';
import baseUrl from '../../utilsClient/baseUrl';
let cancel;

function SearchComponent() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleChange = async (e) => {
    const { value } = e.target;
    setText(value);

    if (!value) return;

    setLoading(true);

    try {
      cancel && cancel();
      const CancelToken = axios.CancelToken;
      const token = cookie.get('token');

      const res = await axios.get(`${baseUrl}/api/search/${value}`, {
        headers: { Authorization: token },
        cancelToken: new CancelToken((canceler) => {
          cancel = canceler;
        }),
      });

      if (res.data.length === 0) return setLoading(false);

      setResults(res.data);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <Search
      onBlur={() => {
        results.length > 0 && setResults([]);
        loading && setLoading(false);
        setText('');
      }}
      loading={loading}
      value={text}
      resultRenderer={ResultRenderer}
      results={results}
      onSearchChange={handleChange}
      minCharacters={1}
      onResultSelect={(e, data) => Router.push(`/${data.result.username}`)}
    />
  );
}

const ResultRenderer = ({ _id, profilePicUrl, name }) => {
  return (
    <List key={_id}>
      <List.Item>
        <Image src={profilePicUrl} alt="ProfilePic" avatar />
        <List.Content header={name} as="a" />
      </List.Item>
    </List>
  );
};

export default SearchComponent;
