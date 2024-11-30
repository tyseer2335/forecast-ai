// src/components/__test__/SourcesContainer.test.tsx
import { fireEvent, render } from "@testing-library/react";
import SourcesContainer from "../SourcesContainer";
import { SourceObject } from "../../hooks/types";

/**
 * 
 * Unit tests for the SourcesContainer component, which displays a list of sources with their
 * respective information such as title, text, image, logo, and metrics. Users can navigate 
 * through the sources using increment and decrement buttons.
 * 
 * The tests in this suite verify:
 * - The initial display of the first source's content.
 * - Proper display of the next source when the increment button is clicked.
 * - Proper display of the previous source when the decrement button is clicked.
 * - Boundary conditions to ensure the display does not go beyond the first or last source 
 *   in the list when trying to increment or decrement past the available sources.
 * 
 * Mock Data:
 * - A list of two sample sources, each containing attributes such as title, text, image URL, 
 *   logo URL, and metrics for testing purposes.
 * 
 * Tests:
 * - **Initial Source Display:** Ensures the first source is displayed initially.
 * - **Next Source Display:** Verifies that clicking the increment button displays the next source.
 * - **Previous Source Display:** Verifies that clicking the decrement button after incrementing 
 *   displays the previous source.
 * - **Boundary Check on Increment:** Ensures that clicking the increment button on the last source 
 *   keeps displaying the last source.
 * - **Boundary Check on Decrement:** Ensures that clicking the decrement button on the first source 
 *   keeps displaying the first source.
 */

const sources: SourceObject[] = [
    { 
        title: "Who Is Favored To Win The 2024 US Election?",
        text: "Much like Democratic presidential candidates in 2016 and 2020, Vice President Kamala Harris has moved the needle in her favor on betting markets and in polling following last week's debate with former President Donald Trump.",
        fullText: "Much like Democratic presidential candidates in 2016 and 2020, Vice President Kamala Harris has moved the needle in her favor on betting markets and in polling following last week's debate with former President Donald Trump.",
        summary: "Kamala Harris is debating with Donald Trump",
        image: "https://via.placeholder.com/150",
        link: "-cnn.article.link.goes.here.com",
        logo: "https://via.placeholder.com/150",
        metrics: { 
            platform: 'facebook.com',
            publisherTitle: 'facebook.com',
            publisherHref: 'facebook.com',
            publishedDate: 'Fri, 24 May 2024 19:50:25 GMT',
            relevanceScore: 3,
            ranking: 2,
            totalArticlesOfSource: 1
        }
    },
    {
        title: "Who will become the next US President?",
        text: "Voters in the US go to the polls on 5 November to elect their next president.",
        fullText: "Voters in the US go to the polls on 5 November to elect their next president.",
        summary: "Voters go vote now",
        image: "https://via.placeholder.com/150",
        link: "-cnn.article.link.goes.here.com",
        logo: "https://via.placeholder.com/150",
        metrics: { 
            platform: 'x.com',
            publisherTitle: 'x.com',
            publisherHref: 'x.com',
            publishedDate: 'Mon, 27 May 2024 10:35:00 GMT',
            relevanceScore: 5,
            ranking: 1,
            totalArticlesOfSource: 2
        }
    }
]

describe(SourcesContainer, () => {
    it("should display the first source initially", () => {
        const setVisibleBiasColor = jest.fn();
        const { getByTestId } = render(<SourcesContainer sources={sources} loading={false} error={undefined} status="Generating Answer" visibleBiasColor="green" setVisibleBiasColor={setVisibleBiasColor} />);
        const sourceTitle = getByTestId("source-title").textContent;
        const sourceText = getByTestId("source-text").textContent;
        const sourceLogo = getByTestId("source-logo");
        const sourceImage = getByTestId("source-image");
        expect(sourceTitle).toEqual(sources[0].title);
        expect(sourceText).toEqual(sources[0].summary);
        expect(sourceLogo).toHaveAttribute("src", sources[0].logo);
        expect(sourceImage).toHaveAttribute("src", sources[0].image);
    });

    it("should display the next source if increment button is clicked", () => {
        const setVisibleBiasColor = jest.fn();
        const { getByTestId } = render(<SourcesContainer sources={sources} loading={false} error={undefined} status="Generating Answer" visibleBiasColor="green" setVisibleBiasColor={setVisibleBiasColor} />);
        const incrementBtn = getByTestId("increment-btn");
        fireEvent.click(incrementBtn);
        const sourceTitle = getByTestId("source-title").textContent;
        const sourceText = getByTestId("source-text").textContent;
        const sourceLogo = getByTestId("source-logo");
        const sourceImage = getByTestId("source-image");
        expect(sourceTitle).toEqual(sources[1].title);
        expect(sourceText).toEqual(sources[1].summary);
        expect(sourceLogo).toHaveAttribute("src", sources[1].logo);
        expect(sourceImage).toHaveAttribute("src", sources[1].image);
    });

    it("should display the previous source if decrement button is clicked", () => {
        const setVisibleBiasColor = jest.fn();
        const { getByTestId } = render(<SourcesContainer sources={sources} loading={false} error={undefined} status="Generating Answer" visibleBiasColor="green" setVisibleBiasColor={setVisibleBiasColor} />);
        const incrementBtn = getByTestId("increment-btn");
        const decrementBtn = getByTestId("decrement-btn");
        fireEvent.click(incrementBtn);
        fireEvent.click(decrementBtn);
        const sourceTitle = getByTestId("source-title").textContent;
        const sourceText = getByTestId("source-text").textContent;
        const sourceLogo = getByTestId("source-logo");
        const sourceImage = getByTestId("source-image");
        expect(sourceTitle).toEqual(sources[0].title);
        expect(sourceText).toEqual(sources[0].summary);
        expect(sourceLogo).toHaveAttribute("src", sources[0].logo);
        expect(sourceImage).toHaveAttribute("src", sources[0].image);
    });

    it("should still display the current source if increment button is clicked and the current source is the last sources", () => {
        const setVisibleBiasColor = jest.fn();
        const { getByTestId } = render(<SourcesContainer sources={sources} loading={false} error={undefined} status="Generating Answer" visibleBiasColor="green" setVisibleBiasColor={setVisibleBiasColor} />);
        const incrementBtn = getByTestId("increment-btn");
        fireEvent.click(incrementBtn);
        fireEvent.click(incrementBtn);
        const sourceTitle = getByTestId("source-title").textContent;
        const sourceText = getByTestId("source-text").textContent;
        const sourceLogo = getByTestId("source-logo");
        const sourceImage = getByTestId("source-image");
        expect(sourceTitle).toEqual(sources[1].title);
        expect(sourceText).toEqual(sources[1].summary);
        expect(sourceLogo).toHaveAttribute("src", sources[1].logo);
        expect(sourceImage).toHaveAttribute("src", sources[1].image);
    });

    it("should still display the current source if decrement button is clicked and the current source is the first sources", () => {
        const setVisibleBiasColor = jest.fn();
        const { getByTestId } = render(<SourcesContainer sources={sources} loading={false} error={undefined} status="Generating Answer" visibleBiasColor="green" setVisibleBiasColor={setVisibleBiasColor} />);
        const decrementBtn = getByTestId("decrement-btn");
        fireEvent.click(decrementBtn);
        const sourceTitle = getByTestId("source-title").textContent;
        const sourceText = getByTestId("source-text").textContent;
        const sourceLogo = getByTestId("source-logo");
        const sourceImage = getByTestId("source-image");
        expect(sourceTitle).toEqual(sources[0].title);
        expect(sourceText).toEqual(sources[0].summary);
        expect(sourceLogo).toHaveAttribute("src", sources[0].logo);
        expect(sourceImage).toHaveAttribute("src", sources[0].image);
    });
})