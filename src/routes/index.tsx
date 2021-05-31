import React from "react";
import { CacheRoute, CacheSwitch } from 'react-router-cache-route';
import loadable from "@loadable/component";
import Loading from "../components/Loading";
import { Redirect } from "react-router-dom";


const [NotFound, Dashboard, TasksJournal, About] = [
    () => import(`../views/NotFound`),
    () => import(`../views/Dashboard`),
    () => import(`../views/TasksJournal`),
    () => import(`../views/About`),
  ].map((item) => {
    return loadable(item as any, {
      fallback: <Loading />,
    });
  });

  export function routes() {
    return (
        <CacheSwitch>
            <CacheRoute exact path="/"  ><Redirect to="/admin" /></CacheRoute>
            <CacheRoute exact path="/admin/index.html" component={Dashboard} />
            <CacheRoute exact path="/admin" component={Dashboard} />
            <CacheRoute exact path="/admin/about" component={About} />
            <CacheRoute exact path="/admin/tasksjournal" component={TasksJournal} />
            <CacheRoute component={NotFound} />
        </CacheSwitch>
    );
};

export default routes;
