import React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { useSelector } from 'react-redux';
import { selectIsAuth } from '../../redux/slices/auth';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from '../../axios';

export const AddPost = () => {
	const navigate = useNavigate();

	const isAuth = useSelector(selectIsAuth);

	const [isLoading, setIsLoading] = React.useState(false);
	const [text, setText] = React.useState('');
	const [title, setTitle] = React.useState('');
	const [tags, setTags] = React.useState('');
	const [imageUrl, setImageUrl] = React.useState('');
	const { id } = useParams();
	const isEditing = Boolean(id);

	const inputFileRef = React.useRef(null);

	const handleChangeFile = async (event) => {
		try {
			const formData = new FormData();
			const file = event.target.files[0];
			formData.append('image', file);
			const { data } = await axios.post('/uploads', formData);
			setImageUrl(data.url);
		} catch (error) {
			console.warn(error);
			alert('Error when uploading the file!');
		}
	};

	const onClickRemoveImage = () => {
		setImageUrl('');
	};

	const onChange = React.useCallback((value) => {
		setText(value);
	}, []);

	const onSubmit = async () => {
		try {
			setIsLoading(true);

			const fields = {
				title,
				tags,
				text,
				imageUrl
			};

			const { data } = isEditing ?
				await axios.patch(`/posts/${id}`, fields) :
				await axios.post('/posts', fields);

			const _id = isEditing ? id : data._id;

			navigate(`/posts/${_id}`);
		} catch (error) {
			console.warn(error);
			alert('Error when create post!');
		}
	};

	React.useEffect(() => {
		if (id) {
			axios.get(`/posts/${id}`).then(({ data }) => {
				setTitle(data.title);
				setTags(data.tags.join(','));
				setText(data.text);
				setImageUrl(data.imageUrl);
			}).catch(error => {
				console.warn(error);
				alert('Error when receiving the post');
			});
		}
	}, []);

	const options = React.useMemo(
		() => ({
			spellChecker: false,
			maxHeight: '400px',
			autofocus: true,
			placeholder: 'Enter text...',
			status: false,
			autosave: {
				enabled: true,
				delay: 1000,
			},
		}),
		[],
	);

	if (!window.localStorage.getItem('token') && !isAuth) {
		return <Navigate to={'/'} />
	};

	return (
		<Paper style={{ padding: 30 }}>
			<Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
				Upload image
			</Button>
			<input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
			{imageUrl && (
				<>
					<Button variant="contained" color="error" onClick={onClickRemoveImage}>
						Delete
					</Button>
					<img className={styles.image} src={`${process.env.REACT_APP_API_URL}${imageUrl}`} alt="Uploaded" />
				</>
			)}
			<br />
			<br />
			<TextField
				classes={{ root: styles.title }}
				variant="standard"
				placeholder="The title of the post..."
				value={title}
				onChange={e => setTitle(e.target.value)}
				fullWidth
			/>
			<TextField
				classes={{ root: styles.tags }}
				variant="standard"
				placeholder="Tags"
				value={tags}
				onChange={e => setTags(e.target.value)}
				fullWidth
			/>
			<SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
			<div className={styles.buttons}>
				<Button onClick={onSubmit} size="large" variant="contained">
					{isEditing ? 'Edit' : 'Publish'}
				</Button>
				<a href="/">
					<Button size="large">Cancel</Button>
				</a>
			</div>
		</Paper>
	);
};
