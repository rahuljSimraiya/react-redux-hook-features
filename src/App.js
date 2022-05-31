import React, { Component, useState, useEffect } from "react";


import JobDashboard from "./containers/Dashboard/JobDashboard";
import SkillDashboard from "./containers/Dashboard/SkillDashboard";
import SaasDashboard from "./containers/Dashboard/SaasDashboard";
import NoMatch from "./components/NoMatch/NoMatch";
import Docs from "./containers/Docs/Docs";
import Login from "./containers/Auth/Login";
import ResetPassword from "./containers/Auth/ResetPassword";
import Home from "./containers/Home/Home";
import { useAuth0 } from '@auth0/auth0-react';
import { useSelector } from 'react-redux';
import { Routes ,Route, BrowserRouter, Navigate  } from 'react-router-dom';

function App(props){
    const state = useSelector((state) => state)

    const accessToken = window.localStorage.getItem('accessToken')
    if(!accessToken){
      const authUrls = ['docs', 'home'];
      const pathname = location.pathname.replaceAll('/','');
      if(authUrls.indexOf(pathname) > -1){
        location.href = '/404'
      }
    }

    return (
          <div className="App container-fluid h-100">
            <BrowserRouter>
              <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/reset-password" element={<ResetPassword />} />
                <Route exact path="/home" element={<Navigate to="/jobs" replace />} />
                <Route exact path="/jobs" element={<JobDashboard />} />
                <Route exact path="/skills" element={<SkillDashboard />} />
                <Route exact path="/saas" element={<SaasDashboard />} />
                <Route exact path="/docs" element={<Docs />} />
                <Route exact path="/404" element={<NoMatch />} />
              </Routes>
            </BrowserRouter>
          </div>
        )
}

export default App;
