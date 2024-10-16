// src/components/__tests__/Sidebar.test.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
// import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { getFirestore, QuerySnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth'; //
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, signInWithGoogle } from "../firebase";
import { exit } from 'process';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { Message } from '../../hooks/types';
import { Timestamp } from 'firebase/firestore';
import { clear } from 'console';

// Mocking react-router-dom (useNavigate)
jest.mock('react-router-dom', () => {
  const nav = jest.fn();
  return {
    ...jest.requireActual('react-router-dom'),
    mockedNavigation: nav,
    useLocation: jest.fn(() => ({ pathname: '/example' })),
    useNavigate: jest.fn(() => nav),
  };
});

const Router = require('react-router-dom');


jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  GoogleAuthProvider: jest.fn(),
}));

// Testing Email and Password
const testCredentials = {
  email: 'irene.kang@mail.utoronto.ca',
  password: 'passwordfortesting',
  uid: 'rjSDnZDZGaPyJ7X79W79m8FF5aU2'
};

// Mock firebase and react-router-dom functions
jest.mock('firebase/firestore');
jest.mock('../firebase', () => ({
  auth: {
    currentUser: { uid: testCredentials.uid },
  },
}));
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  GoogleAuthProvider: jest.fn(),
}));

// Clicking it will call navigate('/'), which should be mocked. Note const navigate - useNavigate().
// To mock navigate, we need to mock useNavigate() function
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));
const mockNavigate = jest.fn();


// Mock database
// collection should have Users/{userId}/Chats collections
const emptyChatCollection = jest.fn();
type DBChatSession = {
  id: string;
  title: string;
  messages: Message[];
  created_at: Timestamp;
  updated_at: Timestamp;
};
const changedId = (chat: DBChatSession, id: string) => ({ ...chat, id });
var todayChat: DBChatSession = { id: '1', title: 'Today chat session', messages: [], created_at: Timestamp.now(), updated_at: Timestamp.now() };
var yesterdayChat: DBChatSession = { id: '2', title: 'Yesterday chat session', messages: [], created_at: Timestamp.now(), updated_at: Timestamp.fromDate(new Date(Date.now() - 1000 * 60 * 60 * 24)) };
var fiveDaysAgoChat: DBChatSession = { id: '5', title: '5 days ago chat session', messages: [], created_at: Timestamp.now(), updated_at: Timestamp.fromDate(new Date(Date.now() - 1000 * 60 * 60 * 24 * 5)) };
var tenDaysAgoChat: DBChatSession = { id: '10', title: '10 days ago chat session', messages: [], created_at: Timestamp.now(), updated_at: Timestamp.fromDate(new Date(Date.now() - 1000 * 60 * 60 * 24 * 10)) };
var thirtyDaysAgoChat: DBChatSession = { id: '30', title: '30 days ago chat session', messages: [], created_at: Timestamp.now(), updated_at: Timestamp.fromDate(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)) };
var sixtyDaysAgoChat: DBChatSession = { id: '60', title: '60 days ago chat session', messages: [], created_at: Timestamp.now(), updated_at: Timestamp.fromDate(new Date(Date.now() - 1000 * 60 * 60 * 24 * 60)) };

const chatCollection0 : Array<DBChatSession> = [];
const chatCollection1Today : Array<DBChatSession> = [todayChat];
const chatCollection3Previous7Days : Array<DBChatSession> = [yesterdayChat, changedId(yesterdayChat, '2-2'), fiveDaysAgoChat];
const chatCollection1Today1Previous7Days2Previous40Days : Array<DBChatSession> = [todayChat, fiveDaysAgoChat, tenDaysAgoChat, thirtyDaysAgoChat];
const chatCollection1Today3Earlier : Array<DBChatSession> = [todayChat, sixtyDaysAgoChat, changedId(sixtyDaysAgoChat, '60-2'), changedId(sixtyDaysAgoChat, '60-3')];
const chatCollection1Today2Previous7Days1Previous30Days1Earlier : Array<DBChatSession> = [todayChat, yesterdayChat, fiveDaysAgoChat, tenDaysAgoChat, thirtyDaysAgoChat, sixtyDaysAgoChat];

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  onSnapshot: jest.fn(),
  Timestamp: jest.requireActual('firebase/firestore').Timestamp,
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('Sidebar', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (require('react-router-dom').useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    // Mock localStorage behavior
    localStorage.clear();
  });


  it('navigates to /login if user is not authenticated', () => {
    if (!auth.currentUser) {
      render(
        <Sidebar newChatId={null} />
      );
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    }
  });

  it('navigates to /login if user is not authenticated with newChatId', () => {
    if (!auth.currentUser) {
      render(
        <Sidebar newChatId={'someRandomChatId'} />
      );
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    }
  });
});



describe('Sidebar with Authentication', () => {

  beforeEach(async () => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    try {
      // Mock successful login
      (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
        user: { emailVerified: true },
      });
    } catch (error) {
      console.error('Login Error:', error);
    }
  });

  // Basic Components (logo, program-title, chat-history, settings-button)

  it('showing logo', async () => {
    render(
        <Sidebar newChatId={null} />
      );
    expect(screen.getByTestId('logo')).toBeInTheDocument();
  }
  );

  it('showing program title', async () => {
    render(
        <Sidebar newChatId={null} />
      );
    expect(screen.getByTestId('program-title')).toBeInTheDocument();
  });

  it('showing chat history', async () => {
    render(
        <Sidebar newChatId={null} />
      );
    expect(screen.getByTestId('chat-history')).toBeInTheDocument();
  });

  it('showing settings button', async () => {
    render(
        <Sidebar newChatId={null} />
      );
    expect(screen.getByTestId('settings-button')).toBeInTheDocument();
  });

  const mockChatList = (chatList: Array<{ id: string; title: string; messages: any[]; created_at: Timestamp; updated_at: Timestamp }>) => {
    jest.mock('firebase/firestore', () => {
      return {
        ...jest.requireActual('firebase/firestore'),
        onSnapshot: jest.fn(),
        query: jest.fn(),
        collection: jest.fn(),
        orderBy: jest.fn(),
      };
    });

    (onSnapshot as jest.Mock).mockImplementation((query, callback) => {
      callback({
        docs: chatList.map(chat => ({
          id: chat.id,
          data: () => ({ ...chat })
        }))
      });
      return jest.fn(); // Return a mock unsubscribe function
    }
    );
  }

  it ('showing chat history with 0 chat sessions', async () => {
    mockChatList(chatCollection0);
    render(
        <Sidebar newChatId={null} />
      );
    expect(screen.getByTestId('chat-history')).toBeInTheDocument();
    // expect exactly 0 chat sessions to be displayed
    expect(screen.queryAllByTestId(/^chat-session-/)).toHaveLength(0);
    }
  );

  it('showing chat history with 1 chat session(Today=1)', async () => {
    // Mock the chat collection to have one chat
    mockChatList(chatCollection1Today);
    
    render(
        <Sidebar newChatId={null} />
      );
    expect(screen.getByTestId('chat-history')).toBeInTheDocument();
    // expect exactly 1 chat session to be displayed
    expect(screen.getAllByTestId(/^chat-session-/)).toHaveLength(1);

    // expect the chat session to have the correct period
    expect(screen.getByText('Today')).toBeInTheDocument();
    // Don't expect other periods to be displayed
    expect(screen.queryByText('Previous 7 days')).toBeNull();
    expect(screen.queryByText('Previous 30 days')).toBeNull();
    expect(screen.queryByText('Earlier')).toBeNull();
  });

  it('showing chat history with 3 chat sessions (Previous 7 days=3)', async () => {
    // Mock the chat collection to have three chat sessions
    mockChatList(chatCollection3Previous7Days);
    
    render(
        <Sidebar newChatId={null} />
      );
    expect(screen.getByTestId('chat-history')).toBeInTheDocument();
    // expect exactly 3 chat sessions to be displayed
    expect(screen.getAllByTestId(/^chat-session-/)).toHaveLength(3);

    // expect the chat session to have the correct period
    expect(screen.getByText('Previous 7 days')).toBeInTheDocument();
    // Don't expect other periods to be displayed
    expect(screen.queryByText('Today')).toBeNull();
    expect(screen.queryByText('Previous 30 days')).toBeNull();
    expect(screen.queryByText('Earlier')).toBeNull();
  });

  it('showing chat history with 4 chat sessions (Today=1, Previous 7 days=2, Previous 30 days=1)', async () => {
    // Mock the chat collection to have four chat sessions
    mockChatList(chatCollection1Today1Previous7Days2Previous40Days);
    
    render(
        <Sidebar newChatId={null} />
      );
    expect(screen.getByTestId('chat-history')).toBeInTheDocument();
    // expect exactly 4 chat sessions to be displayed
    expect(screen.getAllByTestId(/^chat-session-/)).toHaveLength(4);

    // expect the chat session to have the correct period
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Previous 7 days')).toBeInTheDocument();
    expect(screen.getByText('Previous 30 days')).toBeInTheDocument();
    // Don't expect other periods to be displayed
    expect(screen.queryByText('Earlier')).toBeNull();
  }
  );

  it('showing chat history with 4 chat sessions (Today=1, Earlier=3)', async () => {
    // Mock the chat collection to have four chat sessions
    mockChatList(chatCollection1Today3Earlier);
    
    render(
        <Sidebar newChatId={null} />
      );
    expect(screen.getByTestId('chat-history')).toBeInTheDocument();
    // expect exactly 4 chat sessions to be displayed
    expect(screen.getAllByTestId(/^chat-session-/)).toHaveLength(4);

    // expect the chat session to have the correct period
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Earlier')).toBeInTheDocument();
    // Don't expect other periods to be displayed
    expect(screen.queryByText('Previous 7 days')).toBeNull();
    expect(screen.queryByText('Previous 30 days')).toBeNull();
  });

  it('showing chat history with 6 chat sessions (Today=1, Previous 7 days=2, Previous 30 days=1, Earlier=2)', async () => {
    // Mock the chat collection to have six chat sessions
    mockChatList(chatCollection1Today2Previous7Days1Previous30Days1Earlier);
    
    render(
        <Sidebar newChatId={null} />
      );
    expect(screen.getByTestId('chat-history')).toBeInTheDocument();
    // expect exactly 6 chat sessions to be displayed
    expect(screen.getAllByTestId(/^chat-session-/)).toHaveLength(6);

    // expect the chat session to have the correct period
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Previous 7 days')).toBeInTheDocument();
    expect(screen.getByText('Previous 30 days')).toBeInTheDocument();
    expect(screen.getByText('Earlier')).toBeInTheDocument();
  });

  // Chat Click Functionality
  it('clicking a chat session highlights it', async () => {
    // Mock the chat collection to have one chat
    mockChatList(chatCollection1Today2Previous7Days1Previous30Days1Earlier);
    const chatListLength = chatCollection1Today2Previous7Days1Previous30Days1Earlier.length;

    render(
        <Sidebar newChatId={null} />
      );
    expect(screen.getByTestId('chat-history')).toBeInTheDocument();
    // expect exactly 6 chat sessions to be displayed
    var chatSessionElements = screen.getAllByTestId(/^chat-session-/);
    expect(chatSessionElements).toHaveLength(6);
    const markedSelectedStyle = ['bg-button-hover', 'font-bold'];
    const isMarkedSelected = (chatSession: HTMLElement) => chatSession.classList.contains(markedSelectedStyle[0]) && chatSession.classList.contains(markedSelectedStyle[1]);

    // expect no chat session to be markedSelected
    expect(chatSessionElements.every(chatSession => !isMarkedSelected(chatSession))).toBe(true);

    // Click on the chat session
    var secondLastChatSessionElement = chatSessionElements[chatListLength - 2];
    const clickedId = secondLastChatSessionElement.getAttribute('data-testid')?.split('chat-session-')[1];

    fireEvent.click(secondLastChatSessionElement);
    expect(mockNavigate).toHaveBeenCalledWith('/');

    // Now we need to update the elements again
    chatSessionElements = screen.getAllByTestId(/^chat-session-/);

    // expect exactly one chat session to be markedSelected
    const markedSelectedChatSessions = chatSessionElements.filter(chatSession => isMarkedSelected(chatSession));
    expect(markedSelectedChatSessions).toHaveLength(1);
    // expect the clicked session's key = loacalStorage's selectedChatId = markedSelected chat session
    const markedSelectedChatSession = markedSelectedChatSessions[0];
    const markedSelectedChatSessionTestId = markedSelectedChatSession.getAttribute('data-testid');
    console.log("Full Test Id: ", markedSelectedChatSessionTestId);
    const strippedKey = markedSelectedChatSessionTestId?.split('chat-session-')[1];
    console.log("Stripped Key: ", strippedKey);

    expect(strippedKey).toBe(localStorage.getItem('selectedChatId'));

    expect(chatCollection1Today2Previous7Days1Previous30Days1Earlier[chatListLength-2].id).toBe(strippedKey);
    expect(clickedId).toBe(strippedKey);
  });

});