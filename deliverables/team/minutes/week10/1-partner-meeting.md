## Meeting Title

    Partner Meeting	

## Meeting Date

    Saturday November 9th, 2024 ⋅ 1:30pm - 1:53 pm (Eastern Time - Toronto)

## Location

    Discord

## Attendance

    Meeting not mandatory

    Sheldon Huang - partner

    Yuchen Wang - partner

    Yehyun Lee - team coordinator

    Tyseer Toufiq

    Irene Kang


## Agenda / Meeting Overview
1. Deliverable 3 (D3) Goals
2. Progress Overview
3. Discussion with Partner


## Meeting Notes

### Deliverable 3 (D3) Goals

* **Objective**
    * Prepare the Minimum Viable Product (MVP)
* **Cut-Off Scope**
    * Answer generation is the final deliverable for D3

### Progress Overview

1. **Performance Optimization**
    * **Speed Improvements**
        * Running Selenium on Render using Docker initially took longer than expected.
        * Implemented multiprocessing, reducing runtime (from 10 minutes to 5 minutes).
        * Shifted to using Lambda Test for running Selenium, achieving further reduction (from 5 minutes to 1 minute).
        * **Current Total Runtime:** 2 minutes, a significant improvement from the initial 7 minutes.
        * Yehyun took a long time to make this work. Thank you.
2. **UI Enhancements**
    * Implemented a favicon for visual improvement.
    * Minor Features Added:
        * Delete option, Authentication persistence, New chat button functionality
    * Jasjot is also working on further enhancements on authentication.
3. **AI Answer Generation**
    * Next in progress: developing the AI answer generation feature.
    * Yehyun has prepared a mockup code, and Tyseer, Aditya, and Muaj have taken it over for implementation.

### Discussion with Partner

1. **Heatmap Specifications**
    * Partner initially provided JSON files to illustrate what the heatmap should display.
    * Partner clarified that the JSON files are more illustrative and not rigid requirements; Team has flexibility to define the heatmap functionality.
2. **Language Model Output and Token-Level Probability**
    * The language model generates probability data at the token level.
    * Current implementation is at the word level, which meets partner requirements; however, adjustments for character-level granularity are possible.
    * **Simplification Discussion**
        * Team proposed simplifying to token-level probabilities without converting to character-level granularity.
        * Partner confirmed this is acceptable as long as token-level output remains clear and accessible.