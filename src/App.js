import React, { useEffect, useState, forwardRef } from 'react';
import './App.css';
import SearchIcon from '@material-ui/icons/Search';
import HomeIcon from '@material-ui/icons/Home';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import ChatIcon from '@material-ui/icons/Chat';
import InfoIcon from '@material-ui/icons/Info';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import NotificationsIcon from '@material-ui/icons/Notifications';
import CreateIcon from '@material-ui/icons/Create';
import ImageIcon from '@material-ui/icons/Image';
import SubscriptionsIcon from '@material-ui/icons/Subscriptions';
import EventNoteIcon from '@material-ui/icons/EventNote';
import CalendarViewDayIcon from '@material-ui/icons/CalendarViewDay';
import logo from './linkedin.png';
import backy from './mountain.jpg';
import { Avatar } from '@material-ui/core';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import ChatOutlinedIcon from '@material-ui/icons/ChatOutlined';
import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';
import SendOutlinedIcon from '@material-ui/icons/SendOutlined';
import { auth, db } from './firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from './features/counter/userSlice';
import { login, logout } from './features/counter/userSlice';
import FlipMove from 'react-flip-move';

function App() {
  const user = useSelector(selectUser)
  const dispatch = useDispatch();

  useEffect(() => {
    auth.onAuthStateChanged(userAuth => {
      if (userAuth) {
        dispatch(login({
          email: userAuth.email,
          uid: userAuth.uid,
          displayName: userAuth.displayName,
        }))
      } else {
        dispatch(logout());
      }
    })
  }, [])

  return (
    <div className='app'>
      <Header />
      {!user ? (
        <Login />
      ) : (
        <div className='appbody'>
          <Sidebar />
          <Feed />
          <Widgets />
        </div>
      )}

    </div>
  );
}

function Widgets() {

  const newsarticle = (heading, subtitle) => (
    <div className='widgetarticle'>
      <div className='widgetarticleleft'>
        <FiberManualRecordIcon />
      </div>
      <div className='widgetarticleright'>
        <h4>{heading}</h4>
        <p>{subtitle}</p>
      </div>
    </div>
  );

  return (
    <div className='widgets'>
      <div className='widgetheader'>
        <h2>Linkedin News</h2>
        <InfoIcon />
      </div>
      {newsarticle("First article", "Top news - 4500 readers")}
      {newsarticle("Coronavirus: India updates", "Top news - 9622 readers")}
      {newsarticle("Tesla hits new highs", "Cars and auto- 7800 readers")}
      {newsarticle("Bitcoin Breaks $22k", "Crypto - 9856 readers")}
      {newsarticle("Is Redux good?", "Code - 6754 readers")}
    </div>
  );
}

function Header() {
  const dispatch = useDispatch();
  const logoutofapp = () => {
    dispatch(logout());
    auth.signOut();
  }
  return (
    <div className='header'>
      <div className='headerLeft'>
        <img src={logo} alt='linkedin logo' />
        <div className='searchbar'>
          <SearchIcon />
          <input type="text" placeholder='Search' />
        </div>
      </div>
      <div className='headerRight'>
        <HeaderOption Icon={HomeIcon} title="Home" />
        <HeaderOption Icon={SupervisorAccountIcon} title="My Network" />
        <HeaderOption Icon={BusinessCenterIcon} title="Jobs" />
        <HeaderOption onClick={logoutofapp} Icon={ChatIcon} title="Logout" />
        <HeaderOption Icon={NotificationsIcon} title="Notifications" />
      </div>
    </div>
  )
}

function HeaderOption({ Icon, title, onClick }) {
  return (
    <div onClick={onClick} className='headeroption'>
      {Icon && <Icon className='header_icon' />}
      <h3 className='headertitle'>{title}</h3>
    </div>
  )
}

function Sidebar() {

  const user = useSelector(selectUser);

  const recentitem = (topic) => (
    <div className='sidebarrecitem'>
      <span className='sidebarhash'>#</span>
      <p>{topic}</p>
    </div>
  );

  return (
    <div className='sidebar'>
      <div className='sidebartop'>
        <img src={backy} alt="Hey" />
        <Avatar className='sidebaravatar' />
        <h2>{user.displayName}</h2>
        <h4>{user.email}</h4>
      </div>
      <div className='sidebarstats'>
        <div className='sidebarstat'>
          <p>Who viewed you:</p>
          <p className='statnum'>5,667</p>
        </div>
        <div className='sidebarstat'>
          <p>Views on post:</p>
          <p className='statnum'>8,704</p>
        </div>
      </div>
      <div className='sidebarbottom'>
        <p>Recent</p>
        {recentitem('reactjs')}
        {recentitem('programming')}
        {recentitem('design')}
        {recentitem('developer')}
      </div>
    </div>
  )
}

function Feed() {
  const user = useSelector(selectUser);
  const [input, setInput] = useState('');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    db.collection("posts").orderBy('timestamp', 'desc').onSnapshot((snapshot) =>
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );
  }, []);

  const sendPost = e => {
    e.preventDefault();
    db.collection('posts').add({
      name: user.displayName,
      description: user.email,
      message: input,
      photourl: '',
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })

    setInput('');
  };
  return (
    <div className='feed'>
      <div className='feedinputcontainer'>
        <div className='feedinput'>
          <CreateIcon />
          <form>
            <input value={input} onChange={e => setInput(e.target.value)} type="text" />
            <button onClick={sendPost} type='submit'>Send</button>
          </form>
        </div>
        <div className='feedinputoptions'>
          <Inputoption title='Photo' Icon={ImageIcon} color='#70B5F9' />
          <Inputoption title='Video' Icon={SubscriptionsIcon} color='#E7A33E' />
          <Inputoption title='Event' Icon={EventNoteIcon} color='#C0CBCD' />
          <Inputoption title='Write article' Icon={CalendarViewDayIcon} color='#7FC15E' />
        </div>
      </div>
      <FlipMove>
        {posts.map(({ id, data: { name, description, message, photourl } }) => (
          <Post
            key={id}
            name={name}
            description={description}
            message={message}
            photourl={photourl}
          />
        ))}
      </FlipMove>

      <Post name='Soma Datta' description='test' message='nice' />
    </div>
  )
}

function Inputoption({ title, Icon, color }) {
  return (
    <div className='inputoption'>
      <Icon style={{ color: color }} />
      <h4>{title}</h4>
    </div>
  )
}

const Post = forwardRef(({ name, description, message, photourl }, ref) => {
  return (
    <div ref={ref} className='post'>
      <div className='postheader'>
        <Avatar />
        <div className='postinfo'>
          <h2>{name}</h2>
          <p>{description}</p>
        </div>
      </div>
      <div className='postbody'>
        <p>{message}</p>
      </div>
      <div className='postbuttons'>
        <Inputoption Icon={ThumbUpAltOutlinedIcon} title='Like' color='gray' />
        <Inputoption Icon={ChatOutlinedIcon} title='Comment' color='gray' />
        <Inputoption Icon={ShareOutlinedIcon} title='Share' color='gray' />
        <Inputoption Icon={SendOutlinedIcon} title='Send' color='gray' />
      </div>
    </div>
  )
})

function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setname] = useState('');
  const dispatch = useDispatch();

  const logintoapp = (e) => {
    e.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
      .then(userAuth => {
        dispatch(login({
          email: userAuth.user.email,
          uid: userAuth.user.uid,
          displayName: userAuth.user.displayName,
        }))
      }).catch(error => alert(error));
  };
  const register = () => {
    if (!name) {
      return alert("Please enter a full name");
    }
    auth.createUserWithEmailAndPassword(email, password)
      .then((userAuth) => {
        userAuth.user.updateProfile({
          displayName: name,
        })
          .then(() => {
            dispatch(login({
              email: userAuth.user.email,
              uid: userAuth.user.uid,
              displayName: name,
            }))
          })
      }).catch(error => alert(error));
  };
  return (
    <div className='login'>
      <form>
        <input value={name}
          onChange={e => setname(e.target.value)}
          placeholder='Full name'
          type='text'
        />
        <input value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder='Email'
          type='email'
        />
        <input value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder='Password'
          type='password'
        />
        <button type='submit' onClick={logintoapp}>Sign In</button>
      </form>
      <p>Not a member? <span className='loginregister' onClick={register}> Register Now</span></p>
    </div>
  )
}

export default App;
