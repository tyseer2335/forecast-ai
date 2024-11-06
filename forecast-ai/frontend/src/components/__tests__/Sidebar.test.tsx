// src/components/__tests__/Sidebar.test.tsx
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Sidebar from '../Sidebar';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { onSnapshot } from 'firebase/firestore';
import { Message } from '../../hooks/types';
import { Timestamp } from 'firebase/firestore';


// To run the unit test, simply run `npm run test Sidebar.test.tsx`

// The following tests are for the Sidebar component:
//
// 1. Sidebar :: Authentication Tests
// These tests cover scenarios where user authentication impacts navigation.
// Tests:
// ✓ navigates to /login if user is not authenticated
// ✓ navigates to /login if user is not authenticated with newChatId
//
// 2. Sidebar :: Layout Tests
// These tests ensure that specific elements of the sidebar are correctly rendered.
// Tests:
// ✓ displays logo
// ✓ displays program title
// ✓ displays chat history
// ✓ displays settings button
//
// 3. Sidebar :: Chat History Display Tests
// These tests focus on how chat sessions are displayed depending on the number of sessions and their timing.
// Tests:
// ✓ displays 0 chat sessions
// ✓ displays 1 chat session (Today=1)
// ✓ displays 3 chat sessions (Previous 7 days=3)
// ✓ displays 4 chat sessions (Today=1, Previous 7 days=2, Previous 30 days=1)
// ✓ displays 4 chat sessions (Today=1, Earlier=3)
// ✓ displays 6 chat sessions (Today=1, Previous 7 days=2, Previous 30 days=1, Earlier=2)
//
// 4. Sidebar :: Interaction Tests
// These tests validate user interactions with the sidebar, such as clicking on a chat session.
// Tests:
// ✓ highlights a clicked chat session and marks it as selected

// Mocking react-router-dom (useNavigate)
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  GoogleAuthProvider: jest.fn(),
}));

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

// Mock database data
type DBChatSession = {
  id: string;
  title: string;
  messages: Message[];
  created_at: Timestamp;
  updated_at: Timestamp;
};
const getChatWithNewId = (chat: DBChatSession, id: string) => ({ ...chat, id });
var todayChat: DBChatSession = { id: '1', title: 'Today chat session', messages: [], created_at: Timestamp.now(), updated_at: Timestamp.now() };
var yesterdayChat: DBChatSession = { id: '2', title: 'Yesterday chat session', messages: [], created_at: Timestamp.now(), updated_at: Timestamp.fromDate(new Date(Date.now() - 1000 * 60 * 60 * 24)) };
var fiveDaysAgoChat: DBChatSession = { id: '5', title: '5 days ago chat session', messages: [], created_at: Timestamp.now(), updated_at: Timestamp.fromDate(new Date(Date.now() - 1000 * 60 * 60 * 24 * 5)) };
var tenDaysAgoChat: DBChatSession = { id: '10', title: '10 days ago chat session', messages: [], created_at: Timestamp.now(), updated_at: Timestamp.fromDate(new Date(Date.now() - 1000 * 60 * 60 * 24 * 10)) };
var thirtyDaysAgoChat: DBChatSession = { id: '30', title: '30 days ago chat session', messages: [], created_at: Timestamp.now(), updated_at: Timestamp.fromDate(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)) };
var sixtyDaysAgoChat: DBChatSession = { id: '60', title: '60 days ago chat session', messages: [], created_at: Timestamp.now(), updated_at: Timestamp.fromDate(new Date(Date.now() - 1000 * 60 * 60 * 24 * 60)) };

const chatCollection0 : Array<DBChatSession> = [];
const chatCollection1Today : Array<DBChatSession> = [todayChat];
const chatCollection3Previous7Days : Array<DBChatSession> = [yesterdayChat, getChatWithNewId(yesterdayChat, '2-2'), fiveDaysAgoChat];
const chatCollection1Today1Previous7Days2Previous40Days : Array<DBChatSession> = [todayChat, fiveDaysAgoChat, tenDaysAgoChat, thirtyDaysAgoChat];
const chatCollection1Today3Earlier : Array<DBChatSession> = [todayChat, sixtyDaysAgoChat, getChatWithNewId(sixtyDaysAgoChat, '60-2'), getChatWithNewId(sixtyDaysAgoChat, '60-3')];
const chatCollection1Today2Previous7Days1Previous30Days1Earlier : Array<DBChatSession> = [todayChat, yesterdayChat, fiveDaysAgoChat, tenDaysAgoChat, thirtyDaysAgoChat, sixtyDaysAgoChat];

// Mock firebase and react-router-dom functions
jest.mock('../firebase', () => ({
  auth: {
    currentUser: { uid: 'user-id-to-test' },
  },
}));

describe('Sidebar :: Authentication Tests', () => {
  // These tests cover scenarios where user authentication impacts navigation.


  const mockNavigate = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    (require('react-router-dom').useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    localStorage.clear();
  });

  it('navigates to /login if user is not authenticated', () => {
    (auth.currentUser as any) = null;
    expect(auth.currentUser).toBeNull();
    render(
      <Sidebar newChatId={null} />
    );
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('navigates to /login if user is not authenticated with newChatId', () => {
    (auth.currentUser as any) = null;
    render(
      <Sidebar newChatId={'someRandomChatId'} />
    );
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('does not navigate to /login if user is authenticated', () => {
    // Mock the user to be authenticated
    (auth.currentUser as any) = { uid: 'user-id-to-test' };
    render(
      <Sidebar newChatId={null} />
    );
    expect(mockNavigate).not.toHaveBeenCalled();
  }
  );

});

describe('Sidebar :: Layout Tests', () => {
  // These tests ensure that specific elements of the sidebar are correctly rendered.

  // Mocking react-router-dom (useNavigate)
  beforeEach(async () => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  // Basic Components (logo, program-title, settings-button, chat-sessions)

  it('displays logo', async () => {
    render(
        <Sidebar newChatId={null} />
      );
    expect(screen.getByTestId('logo')).toBeInTheDocument();
  }
  );

  it('displays program title', async () => {
    render(
        <Sidebar newChatId={null} />
      );
    expect(screen.getByTestId('program-title')).toBeInTheDocument();
  });

  it('displays chat history', async () => {
    render(
        <Sidebar newChatId={null} />
      );
    expect(screen.getByTestId('chat-sessions')).toBeInTheDocument();
  });

  it('displays settings button', async () => {
    render(
        <Sidebar newChatId={null} />
      );
    expect(screen.getByTestId('settings-button')).toBeInTheDocument();
  });
  
  it('displays chat history', async () => {
    mockChatList(chatCollection1Today2Previous7Days1Previous30Days1Earlier);
    render(
        <Sidebar newChatId={null} />
      );
    expect(screen.getByTestId('chat-sessions')).toBeInTheDocument();
  });
});


describe('Sidebar :: Chat Sessions Display Tests', () => {
  // These tests focus on how chat sessions are displayed depending on the number of sessions and their timing.
  
  // Mocking react-router-dom (useNavigate)
  beforeEach(async () => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it ('displays 0 chat sessions', async () => {
    mockChatList(chatCollection0);
    render(
        <Sidebar newChatId={null} />
      );
    // Expect exactly 0 chat sessions to be displayed
    expect(screen.queryAllByTestId(/^chat-session-/)).toHaveLength(0);
    }
  );

  it('displays 1 chat session(Today=1)', async () => {
    // Mock the chat collection to have one chat
    mockChatList(chatCollection1Today);
    
    render(
        <Sidebar newChatId={null} />
      );
    expect(screen.getByTestId('chat-sessions')).toBeInTheDocument();
    // Expect exactly 1 chat session to be displayed
    expect(screen.getAllByTestId(/^chat-session-/)).toHaveLength(1);

    // Expect the chat session to have the correct period
    expect(screen.getByText('Today')).toBeInTheDocument();
    // Do not expect other periods to be displayed
    expect(screen.queryByText('Previous 7 days')).toBeNull();
    expect(screen.queryByText('Previous 30 days')).toBeNull();
    expect(screen.queryByText('Earlier')).toBeNull();
  });

  it('displays 3 chat sessions (Previous 7 days=3)', async () => {
    // Mock the chat collection to have three chat sessions
    mockChatList(chatCollection3Previous7Days);
    
    render(
        <Sidebar newChatId={null} />
      );
    expect(screen.getByTestId('chat-sessions')).toBeInTheDocument();
    // Expect exactly 3 chat sessions to be displayed
    expect(screen.getAllByTestId(/^chat-session-/)).toHaveLength(3);

    // Expect the chat session to have the correct period
    expect(screen.getByText('Previous 7 days')).toBeInTheDocument();
    // Do not expect other periods to be displayed
    expect(screen.queryByText('Today')).toBeNull();
    expect(screen.queryByText('Previous 30 days')).toBeNull();
    expect(screen.queryByText('Earlier')).toBeNull();
  });

  it('displays 4 chat sessions (Today=1, Previous 7 days=2, Previous 30 days=1)', async () => {
    // Mock the chat collection to have four chat sessions
    mockChatList(chatCollection1Today1Previous7Days2Previous40Days);
    
    render(
        <Sidebar newChatId={null} />
      );
    expect(screen.getByTestId('chat-sessions')).toBeInTheDocument();
    // Expect exactly 4 chat sessions to be displayed
    expect(screen.getAllByTestId(/^chat-session-/)).toHaveLength(4);

    // Expect the chat session to have the correct period
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Previous 7 days')).toBeInTheDocument();
    expect(screen.getByText('Previous 30 days')).toBeInTheDocument();
    // Do not expect other periods to be displayed
    expect(screen.queryByText('Earlier')).toBeNull();
  }
  );

  it('displays 4 chat sessions (Today=1, Earlier=3)', async () => {
    // Mock the chat collection to have four chat sessions
    mockChatList(chatCollection1Today3Earlier);
    
    render(
        <Sidebar newChatId={null} />
      );
    expect(screen.getByTestId('chat-sessions')).toBeInTheDocument();
    // Expect exactly 4 chat sessions to be displayed
    expect(screen.getAllByTestId(/^chat-session-/)).toHaveLength(4);

    // Expect the chat session to have the correct period
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Earlier')).toBeInTheDocument();
    // Do not expect other periods to be displayed
    expect(screen.queryByText('Previous 7 days')).toBeNull();
    expect(screen.queryByText('Previous 30 days')).toBeNull();
  });

  it('displays 6 chat sessions (Today=1, Previous 7 days=2, Previous 30 days=1, Earlier=2)', async () => {
    // Mock the chat collection to have six chat sessions
    mockChatList(chatCollection1Today2Previous7Days1Previous30Days1Earlier);
    
    render(
        <Sidebar newChatId={null} />
      );
    expect(screen.getByTestId('chat-sessions')).toBeInTheDocument();
    // Expect exactly 6 chat sessions to be displayed
    expect(screen.getAllByTestId(/^chat-session-/)).toHaveLength(6);

    // Expect the chat session to have the correct period
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Previous 7 days')).toBeInTheDocument();
    expect(screen.getByText('Previous 30 days')).toBeInTheDocument();
    expect(screen.getByText('Earlier')).toBeInTheDocument();
  });
});

describe('Sidebar :: Interaction Tests', () => {
  // These tests validate user interactions with the sidebar, such as clicking on a chat session.

  // Mocking react-router-dom (useNavigate)
  beforeEach(async () => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  // Chat Click Functionality
it('clicking a chat session highlights it', async () => {
  // Mock the chat collection to have one chat
  mockChatList(chatCollection1Today2Previous7Days1Previous30Days1Earlier);
  const chatListLength = chatCollection1Today2Previous7Days1Previous30Days1Earlier.length;

  // Render the Sidebar component
  render(<Sidebar newChatId={null} />);
  
  // Check if chat history is present
  expect(screen.getByTestId('chat-sessions')).toBeInTheDocument();
  
  // Expect exactly 6 chat sessions to be displayed
  let chatSessionElements = screen.getAllByTestId(/^chat-session-/);
  expect(chatSessionElements).toHaveLength(6);

  // Define the style for marked selected chat session
  const markedSelectedStyle = ['bg-button-hover', 'font-bold'];
  
  // Helper function to check if a chat session is marked as selected
  const isMarkedSelected = (chatSession: HTMLElement) =>
    chatSession.classList.contains(markedSelectedStyle[0]) &&
    chatSession.classList.contains(markedSelectedStyle[1]);

  // Expect no chat session to be marked as selected
  expect(chatSessionElements.every(chatSession => !isMarkedSelected(chatSession))).toBe(true);

  // Click on the second-to-last chat session
  const secondLastChatSessionElement = chatSessionElements[chatListLength - 2];
  const clickedId = secondLastChatSessionElement
    .getAttribute('data-testid')
    ?.split('chat-session-')[1];

  fireEvent.click(secondLastChatSessionElement);
  expect(mockNavigate).toHaveBeenCalledWith('/');

  // Update the chat session elements after click
  chatSessionElements = screen.getAllByTestId(/^chat-session-/);

  // Expect exactly one chat session to be marked as selected
  const markedSelectedChatSessions = chatSessionElements.filter(isMarkedSelected);
  expect(markedSelectedChatSessions).toHaveLength(1);

  // Validate the clicked chat session matches the marked selected session
  const markedSelectedChatSession = markedSelectedChatSessions[0];
  const markedSelectedChatSessionTestId = markedSelectedChatSession.getAttribute('data-testid');
  const strippedKey = markedSelectedChatSessionTestId?.split('chat-session-')[1];

  expect(strippedKey).toBe(localStorage.getItem('selectedChatId'));
  expect(chatCollection1Today2Previous7Days1Previous30Days1Earlier[chatListLength - 2].id).toBe(strippedKey);
  expect(clickedId).toBe(strippedKey);
});
}
);