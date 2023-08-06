import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import './assets/plugins/nucleo/css/nucleo.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './assets/scss/argon-dashboard-react.scss';

import AdminLayout from './layouts/Admin.js';
import AuthLayout from './layouts/Auth.js';

import VideoChatDoctor from './layouts/VideoChatDoctor';
import VideoChatPatient from './layouts/VideoChatPatient';

//temporary region for auto login to karandoc
import { useAuthContext, useMutateAuthContext } from './context/auth';
import { login } from './services/user';
//---------------------------------------------------------

const Routes = () => {
	const { user, fetching } = useAuthContext();

	if (!fetching && user) {
		return (
			<Switch>
				<Route path='/admin' render={(props) => <AdminLayout {...props} />} />
				<Route
					path='/connect/doctor/:id'
					render={(props) => <VideoChatDoctor {...props} />}
				/>
				<Route path='/' render={() => <Redirect to='/admin' />} />
			</Switch>
		);
	} else if (!fetching && !user) {
		return (
			<Switch>
				<Route path='/auth' render={(props) => <AuthLayout {...props} />} />
				<Route path='/' render={() => <Redirect to='/auth' />} />
			</Switch>
		);
	}

	return (
		<Switch>
			<Route path='/admin' render={(props) => <AdminLayout {...props} />} />
			<Route path='/auth' render={(props) => <AuthLayout {...props} />} />
			<Route
				path='/connect/doctor/:id'
				render={(props) => <VideoChatDoctor {...props} />}
			/>
			<Route path='/' render={() => <Redirect to='/admin' />} />
		</Switch>
	);
};

function App() {
	
	//temporary region for auto login to karandoc
	const { user, fetching } = useAuthContext();
	const { updateAuthState } = useMutateAuthContext();
	
	if(!fetching && !user){
		login({
			identifier: 'karan',
			password: 'karandoc',
		}).then(
			({user, error})=>{
			if (user) {
				updateAuthState(
					{ user: user.user, token: user.jwt },
					true
				);
				}
			}
		);
		return <h1>Loading</h1>;	
	}
	//---------------------------------------------------------------

	return (
		<BrowserRouter>
			<Switch>
				<Route
					path='/connect/patient/:roomName'
					render={(props) => <VideoChatPatient {...props} />}
				/>
				<Routes />
			</Switch>
		</BrowserRouter>
	);
}

export default App;
