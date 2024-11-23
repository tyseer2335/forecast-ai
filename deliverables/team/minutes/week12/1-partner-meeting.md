## Meeting Title

    Partner Meeting	

## Meeting Date

    Saturday November 23rd, 2024 ⋅ 1:45 pm - 2:24 pm  (Eastern Time - Toronto)

## Location

    Discord

## Attendance

    Meeting not mandatory

    Sheldon Huang - partner

    Yuchen Wang - partner

    Huakun Shen - partner (new collaborator)

    Yehyun Lee - team coordinator

    Irene Kang

    Muaj Ahmed

    Tyseer Toufiq


## Agenda / Meeting Overview
1. Project Overview
2. Updates
  - 2.1 Heatmap UI Enhancements
  - 2.2 Additional Features
  - 2.3 Other Notes
3. Suggestions from the New Collaborator
4. Suggestions from the Partner
5. Comments from the Team



---

## **Meeting Notes**  

### **Project Overview**  

**Catch-up for the New Collaborator**  
- **Stack Overview**  
  - Self-scraping content chosen to reduce costs.  
  - System flow diagram:  
    - **Frontend**: React  
    - **Backend**: FastAPI  
    - **Database**: Firebase NoSQL  
    - **Authentication**: Firebase  

- **App URL**: [forecast.netlify.app/login](forecast.netlify.app/login)  
  - **Instructions to Use**:  
    - Sign up or log in.  
    - Apply advanced query options and input a query to generate the forecast.  
  - **Query Flow**:  
    1. Backend processes the input query into multiple keywords.  
    2. Filters using Gnews date and platform options.  
    3. Gathers sources, ranks and evaluates them.  
    4. Summarizes sources, generates rationale, and generates bias.  
  - 5-minute explanation of the system flow provided.  

---

### **Updates**

#### **Heatmap UI Enhancements**  
- **Requested Changes**
  - Implement metrics/data toggle to work with the current rationale ranking data.
    - To be implemented in the future.
  - Improve rationale visibility for better user understanding.  
    - Implemented.
    - Rationale now displayed in a more readable format.
  - Change the positions of the metric and detected biases.
    - Implemented.

#### **Additional Features**  
1. **Bias Percentage**  
   - Users can now hover over words to view their associated bias percentage.  
2. **Content/Summary Display**  
   - Previously, articles were summarized before generating rationale but weren’t shown to users.  
   - Now, users can toggle between viewing full content or summaries.  
3. **Raw Response View**  
   - Implemented a feature to display the LLM’s thought process when determining forecast rationale.  

#### **Other Notes**  
- Bias generation currently works on a token basis, but switching to character-based implementation is feasible.  

---

### **Suggestions from the New Collaborator**  
- **Scraping Speed Optimization**  
  - **Proposal by Huakun**:  
    - Instead of relying solely on Selenium for dynamic content rendering:  
      - Use `GET` requests for static content when possible.  
        - This can optimize both speed and quality of the content.
        i.e.,
        1. If servers support the `GET` requests, use them
          - JSON-based approach
        2. Else if servers support server-side rendering, use HTML
        3. Otherwise, use Selenium
          - The idea is to use Selenium only as a fallback for unsupported sites.  
          - While selenium is slower, it can still be used for dynamic content rendering and it almost supports all sites.
    - This approach improves content quality and reduces processing time.  
  - **Challenges**
    - Current objective is to enable scraping from all sources (e.g., Facebook, X), which may require site-specific customizations.  
    - Need to explore ways to auto-detect site requirements or maintain a whitelist of server-side rendering sites.  
  - **Future Considerations**
    - Optimization and scaling can be explored further after this semester.  

---

### **Suggestions from the Partner**  
1. **Sheldon**
- No additional comments—everything looks good.  
2. **Yuchen**
- Suggested minor UI improvement to allow users to submit queries by pressing Enter, in addition to clicking a button.  

---

### **Comments from the Team**  
- Some minor features are still missing, which is disappointing, but we will try to implement as many as possible in the future.
    
---

**<u>References</u>**
- [Google Doc for this Meeting](https://docs.google.com/document/d/1u7M3mH4rSj1CNdg2-Z3-dG2AwQu-C5ssOFHcrx-WQ9A/edit?tab=t.0#heading=h.q7gd714yfbur)
- [Google Drive Folder for All Meeting Notes](https://drive.google.com/drive/folders/19wbnvzlDZjcY7OdiYcD_zqL9pOgYK06t?usp=drive_link)
- Note that all partner and team meeting notes for this project are written by Irene, and please feel free to add or modify the notes if needed.