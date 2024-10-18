#### User Story 💬
"As a researcher, I want to sign up, log in, and log out of the platform. Additionally, I want the ability to recover my password in case I forget it. It's important to me that all users are email-verified and that there are no security vulnerabilities, particularly around password strength. I also want to ensure that my chats are shared only with the individuals I choose."

To meet these needs, we implemented a system that allows users to create accounts on the platform. This will enable them to access user-specific data, such as chat history, at a later time. It was a requirement that all users be email-verified, and we also prioritized security, ensuring users’ data is protected. As part of this, we implemented a password strength checker. Additionally, to improve user experience, we adopted a responsive design and added error validation, notifying users if there were issues during sign-up or login. For example, they might enter a weak password, or their account credentials could be incorrect.

___

#### Acceptance Criteria ✅
- The system must allow users to register on the platform.
- Users must be email-verified before signing in.
- Users should be able to log out of the platform (handled by the U1 team). 
- The system will enforce a password-strength policy, preventing users from signing up with weak passwords.
- The signup page will notify users if an account with the same email already exists.
- The signup page will require users to confirm their password after entering it. 
- The user can only acess user specific data, and cannot do so until they log in (handled by the U1 team). 

___

#### Overview of Decisions 🤔 
##### Which CSS Framework should we use, and why? 
For the user interface, we selected TailwindCSS because its "utility-first" approach allows us to style React components directly, eliminating the need for external stylesheets. This approach accelerates development by enabling rapid prototyping and easy customization while ensuring consistent design with predefined classes. Tailwind offers flexibility for custom styling, enhances responsiveness, and minimizes CSS bloat compared to frameworks like Bootstrap. Additionally, the team's familiarity with Tailwind made it an even more practical and efficient choice for the project.

##### How can we handle user sign-in, authentication, email verification, and reset password? 
We can do so using Firebase as it provides a comprehensive, all-in-one solution perfectly aligned with our project’s needs. Firebase Authentication streamlines user management by handling sign-ups, logins, and secure access control, ensuring only verified users can interact with the platform. Its email verification feature plays a crucial role in confirming user identities, enhancing the overall security of the system by preventing unauthorized access. Firebase also includes a robust password reset feature, allowing users to easily reset forgotten passwords through secure email links, ensuring a smooth user experience.

In addition to authentication, Firebase Firestore, a scalable NoSQL database, was used to manage and store user-related data, such as account details, in real time. Firestore's real-time capabilities allowed us to instantly update user profiles and manage session data without needing complex backend infrastructure. This was mostly used by User Story 2 team.

Overall the seamless integration of these features—authentication, email verification, password reset, and database management—greatly simplified our backend development. Firebase’s serverless architecture meant we didn’t need to manage multiple services or worry about scaling. Furthermore, as the project grows, Firebase easily supports additional features, such as two-factor authentication, and automatically scales to handle an increasing user base. This flexibility and future-proofing made Firebase an ideal solution for our project.

##### How can we measure password strength?
We decided to leverage [zxcvbn](https://github.com/dropbox/zxcvbn), an open-source password strength estimator developed by Dropbox, to provide a more comprehensive evaluation of password security. Unlike traditional methods that only assess strength based on length or special character inclusion, zxcvbn analyzes common patterns, such as dictionary words, sequential characters, or frequently reused passwords. This makes it much more effective at identifying weak passwords. Additionally, it offers real-time feedback, allowing users to immediately understand the quality of their password. zxcvbn categorizes password strength as "Very Weak," "Weak," "Fair," "Good," or "Strong," which is displayed to users for guidance.

##### Replace Firebase's default pages for password reset and email verification?

By default, Firebase redirects users to its standard password reset and email verification pages, which we found to be quite basic and not aligned with our design vision. To improve the user experience, we opted to redesign these pages, making them more visually appealing and cohesive with the overall platform. Furthermore, we were able to add custom styling and extra functionality to enhance usability.

| Old Default Page for Password Reset | New Page for Password Reset |
|----------------------------|--------------------|
| ![Old Default Page](https://i.ibb.co/WfstsnF/iiii.png) | ![New Page for Login](https://i.ibb.co/vvzRQ0c/iiii.png) |

By customizing these pages, we created a more polished and user-friendly interface while still maintaining Firebase's core functionality, such as password resets and email verification workflows.

##### How can we write automated tests for this?

For testing, we used **Jest**, a widely-used testing framework in the JavaScript ecosystem. Jest offers powerful features like test mocking, snapshot testing, and easy integration with React, making it ideal for testing our components. We focused primarily on rendering tests, ensuring that all components rendered correctly, including the login page and other critical parts of the user interface.

While we were unable to implement unit tests for email verification and password reset due to time constraints, we thoroughly tested user interactions like successful login, ensuring that proper error messages were displayed to users upon login failure (e.g., incorrect password). We also verified that buttons redirected to the appropriate pages, such as the password reset and registration pages.

Jest can also be used to test Firebase integrations by mocking Firebase services like authentication and Firestore. Using mock data allows us to simulate user actions, such as logging in or retrieving data from the database, without needing to make real network requests. This enables us to write tests for Firebase-related functionality while ensuring tests run efficiently and consistently.

For more detailed information on our tests, you can check the `front/src/tests` directory, where we've included comments at the top of each test file that outline what specific functionality was tested. Going forward, we plan to expand test coverage to include more detailed unit tests for email verification, password reset flows, and additional edge cases to ensure comprehensive validation of all user interactions.

___ 

#### UI Screenshots 🎨
Heres some screenshots of the pages we made. We can see Desktop and Mobile view 
| Desktop | Mobile |
|----------------------------|--------------------|
| ![Old Default Page](https://i.ibb.co/HNWShzH/Sign-Up.png) | ![New Page for Login](https://i.ibb.co/m87KGHZ/Sign-Up-M.png) | 
| ![Old Default Page](https://i.ibb.co/RPxLdXT/Sign-In.png) | ![New Page for Login](https://i.ibb.co/bBTpXX1/Sign-In-M.png) | 
| ![Old Default Page](https://i.ibb.co/hXYg7Zf/Learn-More.png) | ![New Page for Login](https://i.ibb.co/LrQhv4x/Learn-More-M.png) | 
| ![Old Default Page](https://i.ibb.co/FnwPKfm/Frgot-Pass.png) | ![New Page for Login](https://i.ibb.co/SV0rK9s/Frgot-Pass-M.png) |
___
#### Individual Contributions 👤

##### Tyseer
I contributed to the design of the sign-in page (originally developed by the U1 team) by adding a button to toggle password visibility, improving the user experience. Furthermore, I implemented the display of error messages from Firebase to inform users why they were unable to log in. I also made the sign-in page responsive by adding custom CSS to improve the layout on smaller screens and ensured that other pages, such as the Sign Up, Learn More, Recover Password, and Reset Password pages, were created with responsive design in mind.

Additionally, I implemented email verification for user accounts by setting up Firebase to send verification emails containing a link. After clicking the link, users are redirected to a custom `handle-action` page that verifies the user based on the unique code in the link. The same page also handles password reset requests by reading the email code and redirecting users to the reset password screen if the email was for a password reset rather than verification. I ensured that users could not access the `handle-action` or `reset-password` pages without the proper email code in the URL.

Moreover, I added password strength validation using **zxcvbn**, which measures the strength of the user's password in real-time. Lastly, I wrote tests to verify the functionality of these features.

##### Jasjot
...
___ 
##### Final Notes 📄 
- Deployment can be found [here](https://forecastai.netlify.app/signup)  
- Note that deployment is on main branch so it will have more functionality than U3 
- All the pull requests relating to D2 can be seen  [here](https://github.com/csc301-2024-f/project-14-ml-cs-uoft/pulls?q=is%3Apr+author%3Atyseer2335+is%3Aclosed)
