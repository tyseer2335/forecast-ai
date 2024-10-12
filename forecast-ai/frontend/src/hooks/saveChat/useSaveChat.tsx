// src/hooks/useSaveChat.js
import useGetChatRef from "./_useGetChatRef";
import useSaveUserMessage from "./_useSaveUserMessage";
import useSaveAISourcesMessage from "./_useSaveAISourcesMessage";


const useSaveChat = (userId: string, chatId: string | null) => {
  const saveQuery = async (messageContent: string) => {
    try {

      // 1. Find the chat document
      const getChatRef = useGetChatRef(userId, chatId);
      const chatRef = await getChatRef(messageContent);

      if (!chatRef) {
        console.error("Chat document could not be found or created.");
        return;
      }
    
      // 2. Update the 'messages' array with the new message
      const saveUserMessage = useSaveUserMessage(chatRef);
      saveUserMessage(messageContent);

      // 3. Save the AI source message
      const saveAISourcesMessage = useSaveAISourcesMessage(chatRef);
      const dummySources = [
        { 
            title: "Who Is Favored To Win The 2024 US Election?",
            text: "Much like Democratic presidential candidates in 2016 and 2020, Vice President Kamala Harris has moved the needle in her favor on betting markets and in polling following last week's debate with former President Donald Trump. The shift in the 2024 presidential race offshore-betting odds is more muted than Trump's other opening debates. Still, in the few percentage points he's ceded, bettors now say Harris is more likely to win, according to Polymarket, a crypto-trading platform. The presidential election betting can't be done legally in the U.S. Trump's and Harris' likelihood of winning were knotted at 49% as the debate ended. After moving slightly in Trump's favor the following morning, Polymarket bettors have given Harris a better chance of winning. Her probability stood at 52% to Trump's 47% as of 10:30 a.m. EDT Thursday. Much like Democratic presidential candidates in 2016 and 2020, Vice President Kamala Harris has moved the needle in her favor on betting markets and in polling following last week's debate with former President Donald Trump. The shift in the 2024 presidential race offshore-betting odds is more muted than Trump's other opening debates. Still, in the few percentage points he's ceded, bettors now say Harris is more likely to win, according to Polymarket, a crypto-trading platform. The presidential election betting can't be done legally in the U.S. Trump's and Harris' likelihood of winning were knotted at 49% as the debate ended. After moving slightly in Trump's favor the following morning, Polymarket bettors have given Harris a better chance of winning. Her probability stood at 52% to Trump's 47% as of 10:30 a.m. EDT Thursday. Much like Democratic presidential candidates in 2016 and 2020, Vice President Kamala Harris has moved the needle in her favor on betting markets and in polling following last week's debate with former President Donald Trump. The shift in the 2024 presidential race offshore-betting odds is more muted than Trump's other opening debates. Still, in the few percentage points he's ceded, bettors now say Harris is more likely to win, according to Polymarket, a crypto-trading platform. The presidential election betting can't be done legally in the U.S. Trump's and Harris' likelihood of winning were knotted at 49% as the debate ended. After moving slightly in Trump's favor the following morning, Polymarket bettors have given Harris a better chance of winning. Her probability stood at 52% to Trump's 47% as of 10:30 a.m. EDT Thursday.",
            image: "https://via.placeholder.com/150",
            link: "-cnn.article.link.goes.here.com",
            logo: "https://via.placeholder.com/150",
            metrics: { viewsCount: 483, trendingRate: 22, region: 'Atlanta, USA' }
        }, 
        {
            title: "Who will become the next US President?",
            text: "Voters in the US go to the polls on 5 November to elect their next president. The election was initially a rematch of 2020 but it was upended in July when President Joe Biden ended his campaign and endorsed Vice-President Kamala Harris. The big question now is - will America get its first woman president or a second Donald Trump term? As election day approaches, we'll be keeping track of the polls and seeing what effect the campaign has on the race for the White House. The two candidates went head to head in a televised debate in Pennsylvania on 10 September that just over 67 million people tuned in to watch. A majority of national polls carried out in the week after suggested Harris's performance had helped her make some small gains, with her lead increasing from 2.5 percentage points on the day of the debate to 3.3 points just over a week later. That marginal boost was mostly down to Trump’s numbers though. His average had been rising ahead of the debate, but it fell by half a percentage point in the week afterwards. You can see those small changes in the poll tracker chart below, with the trend lines showing how the averages have changed and the dots showing the individual poll results for each candidate.",
            image: "https://via.placeholder.com/150",
            link: "-cnn.article.link.goes.here.com",
            logo: "https://via.placeholder.com/150",
            metrics: { viewsCount: 762, trendingRate: 43, region: 'New York, USA' }
        }
    ];
      saveAISourcesMessage(dummySources);
      
      console.log("Chat document updated.");
    } catch (e) {
      console.error("Error updating chat document: ", e);
    }
  };

  return saveQuery;
};

export default useSaveChat;
