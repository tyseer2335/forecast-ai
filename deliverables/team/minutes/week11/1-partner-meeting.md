## Meeting Title

    Partner Meeting	

## Meeting Date

    Saturday November 16th, 2024 ⋅ 1:30 pm - 2:09 pm  (Eastern Time - Toronto)

## Location

    Discord

## Attendance

    Meeting not mandatory

    Sheldon Huang - partner

    Yuchen Wang - partner

    Yehyun Lee - team coordinator

    Ho Kwan Edison Liem

    Irene Kang

    Muaj Ahmed

    Jasjot Benipal


## Agenda / Meeting Overview
1. Plans for D4
2. Updates
    - Major Updates
        - Answer Generation
        - Bias Generation
        - Heatmap
    - Minor Implementations


## Meeting Notes

### Plans for D4
* **Objective**
    - Focuses mainly on presenting to the TA
    - We are willing to improve the platform based on the partner’s feedback

### Updates

#### Features Implemented:  
##### Favicon features  
##### Summarizing source content to feed into LLM  
    - Previously, when we are trying to feed the ranked articles with text content into LLM to generate a forecast answer, we often come up with an error of maximum token issue.   
    - It seems like gpt4-0 have a maximum text limit of 9000\.   
    - In order to solve this issue, we have to summarize each source content before feeding it into LLM.  
    - Currently, the source display shows full content, but since summarization is ready, we can switch if the partner prefers this approach.  
##### Answer Generation  
  - Started from `539` code  
  - An external file \`prompt.py\` is needed for this process  
##### Authentication caching   
##### Logout button   
##### Bias Generation  
  - Implemented using a dictionary, but design decision failure as we discussed  
    - Keys:  
      - Statistical Reasoning  
      - Statistical Refinement  
      - Causal Reasoning  
      - Statistical Causal Blend  
  - Planned improvements:  
    - Use an array instead of a dictionary to improve structure.  
    - Enhance design
  - Feedback from partner on UI:  
    - Make metrics and detected biases accessible without requiring users to scroll up and down  
  - Metrics:  
    - Skipped the implementations  
      - Since we want to support any types of sources, it is hard to extract the view count dynamically due to all different structures  
    - Feedback:   
      - Understandable decision  
      - Metrics are a lower priority.   
      - Their main purpose is to display the quality of the source  
      - Suggestion:   
        - Add data from the source ranking  
        - It would be nice for users to expand and see the rationale (default: hidden)  
        - For metrics, include rationale for:  
          - Summarize article  
          - Ranking rationale

          with toggle feature

#### Prod Website  
  - Initial plan was to provide access to partners and course staff.  
  - Concern: Time limit of 100 minutes may affect performance if exceeded  
  - Worst-case solution: Switch to Docker.  
### Question 
  - Currently using Lambdatest for scraping content, but it's expensive. Are there any comments or suggestion?  
  - Feedback:  
    - Partners are not familiar with Lambdatest but are happy with the current results.  
    - Ensure it works on SSH.  
### Next Steps Summary
- Before D4, we will be improving the aspects based on the partner’s feedback:  
  - Fix metrics to output actual data  
  - Enhance the UI for the heatmap  
    - Feedback on UI:   
      - It's not easy to distinguish stats from highlights  
      - I.e. which one has higher / lower value  
      - Maybe use white background  
    - We will try different options   
  - Adjust UI for detected biases and metrics so users do not need to scroll up and down  
  - Implement expandable rationale for metrics  
  - Ensure SSH functionality using Lambdatest on their own server  
  - Make the arrow for switching to the next / previous source more visible in the UI  
### Overall Feedback  
  - Partners are very satisfied and excited to use the project  
  - They are open to pursuing publications as the next steps  
  - Final Note  
    - Rest well between deadlines, enjoy your time
    
---

**<u>References</u>**
- [Google Doc for this Meeting](https://docs.google.com/document/d/18od27mKhtgeuQtoigxKNCAD35KUN9gDHEOPPNzAB3is/edit?usp=sharing)
- [Google Drive Folder for All Meeting Notes](https://drive.google.com/drive/folders/19wbnvzlDZjcY7OdiYcD_zqL9pOgYK06t?usp=drive_link)
- Note that all partner and team meeting notes for this project are written by Irene, and please feel free to add or modify the notes if needed.