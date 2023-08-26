import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";

import styles from "./Login.module.scss";
import { fetchAuth, selectIsAuth } from "../../redux/slices/auth";

export const Login = () => {
	const dispath = useDispatch();

	const isAuth = useSelector(selectIsAuth);

	const {
		register,
		handleSubmit,
		formState: { errors, isValid }
	} = useForm({
		defaultValues: {
			email: '',
			password: ''
		},
		mode: 'onChange'
	});

	const onSubmit = async (values) => {
		const data = await dispath(fetchAuth(values));

		if (!data.payload) {
			alert('Failed to authorize!');
		}

		if ('token' in data.payload) {
			window.localStorage.setItem('token', data.payload.token);
		};
	};

	if (isAuth) {
		return <Navigate to={'/'} />
	};

	return (
		<Paper classes={{ root: styles.root }}>
			<Typography classes={{ root: styles.title }} variant="h5">
				Log in account
			</Typography>
			<form onSubmit={handleSubmit(onSubmit)}>
				<TextField
					className={styles.field}
					label="E-Mail"
					type="email"
					error={Boolean(errors.email?.message)}
					helperText={errors.email?.message}
					fullWidth
					{...register('email', { required: 'Enter email' })}
				/>
				<TextField
					className={styles.field}
					label="Password"
					type="password"
					error={Boolean(errors.password?.message)}
					helperText={errors.password?.message}
					fullWidth
					{...register('password', { required: 'Enter password' })} />
				<Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
					Log in
				</Button>
			</form>
		</Paper>
	);
};
