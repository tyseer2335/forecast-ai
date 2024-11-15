# HeavyLifters

## Iteration 03 - Review & Retrospect

 * When: 2024/11/12
 * Where: Online

## Process - Reflection

#### Q1. What worked well
1. **Clear Communication Channels for Feature Development and Partner Coordination**  
   We established dedicated Discord channels for each subteam, as well as one for communication with our project partner. This setup enabled seamless collaboration within our subteams on individual features while also fostering smooth coordination with the partner team on shared features and integration points. By having separate channels for different aspects of the project—such as feature development and partner updates—we kept conversations focused, organized, and efficient, ensuring everyone stayed aligned on the project's progress.  

   ![Discord Channel Structure](https://i.ibb.co/n3t3y95/aasdadsad.png)


2. **Clear Version Control and Branching Strategy**  
   We implemented a well-defined branching strategy, using feature branches and doc branches to keep changes organized and minimize conflicts. This allowed independent development on subcomponents while maintaining a cohesive overall structure. The branching strategy helped prevent integration issues by ensuring that changes were isolated and reviewed before merging.

   ![Discord Channel Structure](https://i.ibb.co/zNYDYr8/hhhadfgad.png)

3. **Well-Defined Role Responsibilities**  
   We clarified individual responsibilities early in the project, which helped streamline workflows and avoid task overlap. Each team member had a clear understanding of their deliverables, reducing confusion during the integration phase and ensuring that everyone knew what was expected of them. This clear role delineation contributed to a more efficient and focused team effort.

4. **Documentation of Important Features**  
   We made sure to document key features and their functionality in detail. This thorough documentation made it easier for subteams to implement their respective code or integrate with existing components. Clear documentation minimized the need for back-and-forth clarification, ensuring that everyone understood the functionality and behavior of critical features, and speeding up the development process.

#### Q2. What did not work well

1. **Underestimating Feature Completion Time**  
   At times, we underestimated how long certain features would take to complete, which led to needing extension on some tasks. This created a bit of pressure as deadlines approached. However, despite the initial time estimation challenges, we were able to overcome this by adjusting our schedules and redistributing tasks where necessary, ensuring we met all the critical milestones.

2. **Insufficient Research on Tool Pricing and Limitations**    
   Sometimes, we could have conducted more thorough research on the pricing and limitations of some tools we were using. We later discovered certain constraints that we had not anticipated, leading to wasted time as we had to figure out alternative solutions. However, we managed to overcome this issue as our codebase was designed with flexibility in mind, allowing us to easily adapt to different configurations and tools.

#### Q3(a). Planned changes

1. Improved Time Management and Prioritization: 
- **Challenge**:
   - A primary challenge our team faces is the allocation of time to various development processes. 
   - We often see high-priority tasks being delayed by errors/issues or by additional requests that disrupt planned work. 
- **Planned change**:
   - To address this, we will adopt task prioritization and implement daily check-ins with the team to ensure task progress and completion.

2. Buffer Time Between Task Completion and Releases:
- **Challenge**:
   - An important lesson we've learned from previous releases is the importance of buffer time between completing development tasks and deploying them for release. 
   - This time helps to ensure that any last-minute changes or unforeseen issues can be addressed without disrupting the release. 
- **Planned change**:
   - Moving forward, we will ensure not to deploy last-minute changes and have releases ready earlier for more reliable timelines, reduced stress during releases, and better quality assurance.

#### Q3(b). Integration & Next steps
We facilitated communication between the subteams to ensure smooth integration by having representatives from each subteam discuss their code and potential conflicts. This collaborative approach helped identify issues early, ensuring a seamless merging process across the three sub-repos.The assignment was helpful because it gave everyone valuable experience in how merging would work in the real world, promoting effective communication and coordination across subteams to ensure a smooth integration of components. 

## Product - Review

#### Q4. How was your product demo?

* **How did you prepare your demo?**  
  - To prepare our demo, we hosted our app on Netlify for the frontend [ForecastAi](https://forecastai.netlify.app/signup) and used Render for backend hosting. This setup allowed our partners (or anyone else) to access our app in the browser without needing to download anything.

* **What did you manage to demo to your partner?**  
  - We successfully demonstrated the following features:
    - User login and logout functionality
    - Password reset and email authentication
    - News collection and display
    - Answer generation
    - Bias detection
    - Color-coded heatmap for visual insights

* **Did your partner accept the features? And were there change requests?**  
  - All the features were accepted by our partner, but they requested a few improvements and additional functionality.
  - Change requests:
    - Enhance performance during data fetching (currently takes 2 minutes; the goal is to reduce this time)
    - Implement a chat-sharing feature to allow users to share view-only chats
    - Add a logout button for better user control

* **What were your learnings through this process?**  
  - From a **process perspective**:
    - Dividing the work into three subteams allowed each group to focus on individual components independently, reducing dependencies on other parts. Additionally, assigning tasks based on team members' strengths and collaborating on specific features was a valuable learning experience. Coordinating and merging each component smoothly into a cohesive whole was also a key takeaway.
  - From a **product perspective**:
    - There are many considerations that only become apparent after development begins. For example, we initially planned to implement login/logout functionality but then realized we also needed to handle cases like forgotten passwords or weak password security. These edge cases can sometimes go unnoticed until we start building the feature, which was a key takeaway. 

