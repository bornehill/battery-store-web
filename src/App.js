import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import { routes, RouteWithSubRoutes } from "./routes";
import { AuthProvider } from "./providers/Auth.provider";

class App extends React.Component {
	render() {
		return (
			<BrowserRouter>
				<AuthProvider>
					<Switch>
						{routes.map((route, i) => (
							<RouteWithSubRoutes key={i} {...route} />
						))}
					</Switch>
				</AuthProvider>
			</BrowserRouter>
		);
	}
}

export default App;
