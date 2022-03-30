import React from 'react';
import {getIdParam, getParam} from "../../common/paramsGetter";
import {render} from "../../common/appRender";
import AppProvider from "../../common/components/smarts/AppProvider";
import Page from "./Page";

const app = <App/>
render(app)

function App() {
    return (
        <AppProvider>
            <Page id={getIdParam()} studentId={getParam("studentId")}/>
        </AppProvider>
    )
}