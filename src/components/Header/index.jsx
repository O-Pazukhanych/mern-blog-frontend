import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectIsAuth } from '../../redux/slices/auth';

export const Header = () => {
	const isAuth = useSelector(selectIsAuth);

	const dispath = useDispatch();

	const onClickLogout = () => {
		if (window.confirm('Are you sure you want to log?')) {
			dispath(logout());
			window.localStorage.removeItem('token');
		}
	};

	return (
		<div className={styles.root}>
			<Container maxWidth="lg">
				<div className={styles.inner}>
					<Link className={styles.logo} to="/">
						<div>MERN BLOG</div>
					</Link>
					<div className={styles.buttons}>
						{isAuth ? (
							<>
								<Link to="/add-post">
									<Button variant="contained">Create post</Button>
								</Link>
								<Button onClick={onClickLogout} variant="contained" color="error">
									Log out
								</Button>
							</>
						) : (
							<>
								<Link to="/login">
									<Button variant="outlined">Log in</Button>
								</Link>
								<Link to="/register">
									<Button variant="contained">Create account</Button>
								</Link>
							</>
						)}
					</div>
				</div>
			</Container>
		</div>
	);
};
