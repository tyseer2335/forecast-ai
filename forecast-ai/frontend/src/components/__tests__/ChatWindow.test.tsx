import React from 'react';
import { render, screen } from '@testing-library/react';
import ChatWindow from '../ChatWindow';
import { Chat, SourceObject } from '../../hooks/types';

// To run the unit test, simply run `npm run test ChatWindow.test.tsx`

// The following tests are for the ChatWindow component:
// 1. ChatWindow :: Rendering and Layout Tests
// These tests ensure that the ChatWindow renders correctly and its layout is as expected.
// Tests:
// ✓ renders without crashing with an empty chats array
// ✓ renders the correct number of ChatMessage and SourcesContainer components for each chat
//
// 2. ChatWindow :: Scrolling Behavior Tests
// These tests check that the automatic scrolling functionality behaves correctly when new chats are added.
// Tests:
// ✓ scrolls to the bottom when the component initially renders
// ✓ scrolls to the bottom when new chats are added
// ✓ does not trigger scrolling if no new chats are added
//
// 3. ChatWindow :: Chat Message and Sources Content Rendering Tests
// These tests ensure that chat messages and their associated sources are correctly rendered and displayed.
// Tests:
// ✓ renders each ChatMessage component with the correct query
// ✓ renders each SourcesContainer component with the correct sources
//
// 4. ChatWindow :: Dynamic Updates
// These tests verify that the component responds correctly to prop changes and updates dynamically.
// Tests:
// ✓ updates the chat window dynamically when new chat messages are received
// ✓ correctly handles chat data structure with different properties (e.g., missing or empty sources)
//
// 5. ChatWindow :: Performance and Efficiency Tests
// These tests check that the component performs efficiently, especially when dealing with a large number of chat messages.
// renders a large number of chat messages efficiently
// ✓ renders a large number of sources within a chat message without issues

// Mock child components
jest.mock('../ChatMessage', () => ({ query }: { query: string }) => <div data-testid="chat-message">{query}</div>);
// jest.mock('../SourcesContainer', () => () => <div data-testid="sources-container" />);
jest.mock('../SourcesContainer', () => ({ sources }: { sources: SourceObject[] }) => (
  <div data-testid="sources-container">
    {sources.map((source, index) => (
      <div key={index} data-testid="source-section">
        {source.title}
      </div>
    ))}
  </div>
));
// Mock the scrollIntoView method with { behavior: 'smooth' }
Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { value: jest.fn(), writable: true });
const sampleChats: Chat[] = [
  {
    query: 'What is the weather tomorrow?',
    sources: [
      {
        title: 'Weather Report',
        text: 'It is sunny today.',
        image: 'https://via.placeholder.com/150',
        link: 'https://weather.com',
        logo: 'https://via.placeholder.com/150',
        metrics: {
          viewsCount: 100,
          trendingRate: 10,
          region: 'Atlanta, USA',
        },
      },
    ],
    loading: false,
  },
  {
    query: 'What is the stock price for Apple?',
    sources: [
      {
        title: 'Stock Report',
        text: 'Apple stock is up by 1%.',
        image: 'https://via.placeholder.com/150',
        link: 'https://stock.com',
        logo: 'https://via.placeholder.com/150',
        metrics: {
          viewsCount: 200,
          trendingRate: 15,
          region: 'Ontario, CA',
        },
      },
    ],
    loading: false,
  },
];

describe('ChatWindow :: Layout Tests', () => {
  it('renders without crashing with empty chats array', () => {
    render(<ChatWindow chats={[]} />);
    expect(screen.getByTestId('chat-window')).toBeInTheDocument();
    expect(screen.queryAllByTestId('chat-message')).toHaveLength(0);
  });

  it('renders correct number of ChatMessage and SourcesContainer for each chat', () => {
    render(<ChatWindow chats={sampleChats} />);
    // Expect 2 chat messages = length of sampleChats
    expect(screen.getAllByTestId('chat-message')).toHaveLength(sampleChats.length);
    // Expect 2 sources containers = length of sampleChats
    expect(screen.getAllByTestId('sources-container')).toHaveLength(sampleChats.length);
    // Expect 1 chat window
    expect(screen.getAllByTestId('chat-window')).toHaveLength(1);
});
});


describe('ChatWindow :: Scroll Behaviour', () => {
  // Scrolls to the bottom when component initially renders
  it('scrolls to the bottom when the component initially renders', () => {
    //Render the component with chats already present
    const { rerender } = render(<ChatWindow chats={sampleChats} />);

    // Mock the scrollIntoView method on the bottomRef
    const bottomRefs = screen.getAllByTestId('bottom-ref');
    const bottomRef = bottomRefs[bottomRefs.length - 1];

    rerender(<ChatWindow chats={sampleChats} />);

    // Expect scrollIntoView to be called on initial render
    expect(bottomRef.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('scrolls to the bottom when new chats are added', () => {
    // Render the component with no chats first
    const { rerender } = render(<ChatWindow chats={[]} />);

    // Expect there is no bottomRef initially, as there is no chat
    expect(screen.queryByTestId('bottom-ref')).not.toBeInTheDocument();

    // Re-render the component with new chats
    rerender(<ChatWindow chats={sampleChats.concat(sampleChats)} />);

    // Mock the scrollIntoView method on the bottomRef
    const bottomRefs = screen.getAllByTestId('bottom-ref');
    const bottomRef = bottomRefs[bottomRefs.length - 1];

    // Verify that scrollIntoView was called with the expected argument
    expect(bottomRef.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  // Does not scroll to the bottom if no new chats are added
  it('does not trigger scrolling if no new chats are added', () => {
    const { rerender } = render(<ChatWindow chats={sampleChats} />);
    const bottomRefs = screen.getAllByTestId('bottom-ref');
    const bottomRef = bottomRefs[bottomRefs.length - 1];

    // Mock scrollIntoView
    const mockScrollIntoView = jest.fn();
    bottomRef.scrollIntoView = mockScrollIntoView;

    // Re-render with the same chats
    rerender(<ChatWindow chats={sampleChats} />);

    // Ensure scrollIntoView is not called again if the same chats are provided
    expect(mockScrollIntoView).not.toHaveBeenCalled();
  });
});

describe('ChatWindow :: Correct Content', () => {
  // Renders each ChatMessage with correct query
  it('renders each ChatMessage component with correct query', () => {
    render(<ChatWindow chats={sampleChats} />);
    
    sampleChats.forEach((chat, index) => {
        expect(screen.getAllByTestId('chat-message')[index]).toHaveTextContent(chat.query);
    });
  });

  // Renders each SourcesContainer with correct sources
  it('renders each SourcesContainer with correct sources', () => {
    render(<ChatWindow chats={sampleChats} />);
    
    sampleChats.forEach((chat, index) => {
        const sourcesContainer = screen.getAllByTestId('sources-container')[index];
        expect(sourcesContainer).toBeInTheDocument();
        // Verify the sources are passed correctly
        chat.sources.forEach(source => {
            expect(sourcesContainer).toHaveTextContent(source.title);
        });
    });
  });
});


describe('ChatWindow :: Dynamic Updates', () => {
  // Updates chat window dynamically when new chat messages are added
  it('updates the chat window dynamically when new chat messages are added', () => {
    const { rerender } = render(<ChatWindow chats={[]} />);

    // Initially, no chat messages should be present
    expect(screen.queryAllByTestId('chat-message')).toHaveLength(0);

    // Re-render with chats added
    rerender(<ChatWindow chats={sampleChats} />);

    // Now the number of chat messages should match the chats array
    expect(screen.getAllByTestId('chat-message')).toHaveLength(sampleChats.length);
  });

  // Handles chat data structure with missing or empty sources
  it('handles chat data with empty sources', () => {
    
    // Sample chat with missing sources
    const chatsWithMissingSources = 
      [
        sampleChats[0],

        {
          query: 'What is the stock price for Apple?',
          sources: [],
          loading: false,
        },
      ];
    render(<ChatWindow chats={chatsWithMissingSources} />);

    chatsWithMissingSources.forEach((chat, index) => {
        const chatMessage = screen.getAllByTestId('chat-message')[index];
        expect(chatMessage).toHaveTextContent(chat.query);
    });
    // Expect the first SourcesContainer to be not empty
    expect(screen.queryAllByTestId('sources-container')[0]).not.toBeEmptyDOMElement();
    // Expect the second SourcesContainer to be empty
    expect(screen.queryAllByTestId('sources-container')[1]).toBeEmptyDOMElement();
  });
});


describe('ChatWindow :: Performance and Efficiency Tests', () => {
  // Efficiently renders a large number of chat messages without performance degradation
  it('renders a large number of chat messages efficiently', () => {
    const largeChatArray = new Array(1000).fill({ query: 'Sample Query', sources: [] });

    render(<ChatWindow chats={largeChatArray} />);

    expect(screen.getAllByTestId('chat-message')).toHaveLength(1000);
    expect(screen.getAllByTestId('sources-container')).toHaveLength(1000);
  });

  // Handles a large number of sources within each chat message without layout issues
  it('renders a large number of sources within a chat message without issues', () => {
    const chatWithManySources = {
        query: "How does AI work?",
        sources: new Array(100).fill({ title: 'Sample Source', text: 'Sample Text', image: '', link: '', logo: '', metrics: { viewsCount: 100, trendingRate: 50, region: 'NY' } }),
        loading: false,
    };

    render(<ChatWindow chats={[chatWithManySources]} />);

    // Expect 1 Chat rendered correctly
    expect(screen.getAllByTestId('chat-message')).toHaveLength(1);
    expect(screen.getAllByTestId('sources-container')).toHaveLength(1);
    // Expect 100 sources rendered correctly
    expect(screen.getAllByTestId('source-section')).toHaveLength(100);
  });
});