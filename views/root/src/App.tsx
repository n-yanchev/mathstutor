import React from 'react';
import Root from "./Root";
import {ApolloClient, ApolloProvider, createHttpLink, InMemoryCache} from "@apollo/client";
import {CssBaseline} from "@material-ui/core";

const link = createHttpLink({
    uri: 'https://api.mathstutor.ru/gateway',
    credentials: 'include'
});

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link
});


function App() {

    return (
        <ApolloProvider client={client}>
            <CssBaseline/>
            <Root/>
        </ApolloProvider>
    )
}

export default App
