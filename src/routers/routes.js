import React, { Suspense, lazy } from "react";
import { Layout } from 'antd';
import { withRouter } from "react-router";
import Footer from '../components/layout/footer/footer';
import Header from '../components/layout/header/header';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import NotFound from '../components/notFound/notFound';
import Sidebar from '../components/layout/sidebar/sidebar';
import PrivateRoute from '../components/PrivateRoute';
import PublicRoute from '../components/PublicRoute';

const { Content } = Layout;

const Login = lazy(() => {
    return Promise.all([
        import('../pages/Login/login'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});


const AccountManagement = lazy(() => {
    return Promise.all([
        import('../pages/AccountManagement/accountManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});


const AccountCreate = lazy(() => {
    return Promise.all([
        import('../pages/AccountManagement/AccountCreate/accountCreate'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const PlanningManager = lazy(() => {
    return Promise.all([
        import('../pages/PlanningManager/planningManager'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const FinancialReport = lazy(() => {
    return Promise.all([
        import('../pages/FinancialReport/financialReport'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const MilestoneManager = lazy(() => {
    return Promise.all([
        import('../pages/MilestoneManager/milestoneManager'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const RequestVolunteer = lazy(() => {
    return Promise.all([
        import('../pages/RequestVolunteer/requestVolunteer'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const DonorManagement = lazy(() => {
    return Promise.all([
        import('../pages/DonorManagement/donorManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const StoryManagement = lazy(() => {
    return Promise.all([
        import('../pages/StoryManagement/storyManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const IssueManagement = lazy(() => {
    return Promise.all([
        import('../pages/IssueManagement/issueManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const GeneralReportsManagement = lazy(() => {
    return Promise.all([
        import('../pages/GeneralReports/generalReports'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const TaskReportsManagement = lazy(() => {
    return Promise.all([
        import('../pages/TaskReportsManagement/taskReportsManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const Profile = lazy(() => {
    return Promise.all([
        import('../pages/Profile/profile'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const NewManagement = lazy(() => {
    return Promise.all([
        import('../pages/NewManagement/newsManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const MediaManagement = lazy(() => {
    return Promise.all([
        import('../pages/MediaManagement/mediaManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const CreateMedia = lazy(() => {
    return Promise.all([
        import('../pages/MediaManagement/createMediaManagement/createMedia'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});


const RouterURL = withRouter(({ location }) => {

    const LoginContainer = () => (
        <div>
            <PublicRoute exact path="/">
                <Login />
            </PublicRoute>
            <PublicRoute exact path="/login">
                <Login />
            </PublicRoute>
        </div>
    )

    const DefaultContainer = () => (
        <PrivateRoute>
            <Layout style={{ minHeight: '100vh' }}>
                <Sidebar />
                <Layout >
                    <Header />
                    <Content style={{ marginLeft: 230, width: 'calc(100% - 230px)', marginTop: 50 }}>


                        <PrivateRoute exact path="/account-management">
                            <AccountManagement />
                        </PrivateRoute>

                        <PrivateRoute exact path="/account-create">
                            <AccountCreate />
                        </PrivateRoute>

                        <PrivateRoute exact path="/profile">
                            <Profile />
                        </PrivateRoute>

                        <PrivateRoute exact path="/notfound">
                            <NotFound />
                        </PrivateRoute>

                        <PrivateRoute exact path="/campaign-management">
                            <PlanningManager />
                        </PrivateRoute>

                        <PrivateRoute exact path="/financial-management">
                            <FinancialReport />
                        </PrivateRoute>

                        <PrivateRoute exact path="/milestone-management">
                            <MilestoneManager />
                        </PrivateRoute>

                        <PrivateRoute exact path="/request-volunteer">
                            <RequestVolunteer />
                        </PrivateRoute>

                        <PrivateRoute exact path="/donor-management">
                            <DonorManagement />
                        </PrivateRoute>

                        <PrivateRoute exact path="/story-management">
                            <StoryManagement />
                        </PrivateRoute>

                        <PrivateRoute exact path="/issue-management">
                            <IssueManagement />
                        </PrivateRoute>

                        <PrivateRoute exact path="/reports-management">
                            <GeneralReportsManagement />
                        </PrivateRoute>

                        <PrivateRoute exact path="/task-reports-management">
                            <TaskReportsManagement />
                        </PrivateRoute>

                        <PrivateRoute exact path="/news-management">
                            <NewManagement />
                        </PrivateRoute>

                        <PrivateRoute exact path="/media-management">
                            <MediaManagement />
                        </PrivateRoute>

                        <PrivateRoute exact path="/create-media">
                            <CreateMedia />
                        </PrivateRoute>

                        <PrivateRoute exact path="/notfound">
                            <NotFound />
                        </PrivateRoute>
                    </Content>
                    <Footer />
                </Layout>
            </Layout>
        </PrivateRoute >
    )

    return (
        <div>
            <Router>
                <Switch>
                    <Route exact path="/">
                        <LoginContainer />
                    </Route>
                    <Route exact path="/login">
                        <LoginContainer />
                    </Route>

                    <Route exact path="/account-create">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/account-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/campaign-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/financial-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/milestone-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/request-volunteer">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/donor-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/story-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/issue-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/reports-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/task-reports-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/news-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/media-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/profile">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/create-media">
                        <DefaultContainer />
                    </Route>
                    <Route>
                        <NotFound />
                    </Route>
                </Switch>
            </Router>
        </div>
    )
})

export default RouterURL;
