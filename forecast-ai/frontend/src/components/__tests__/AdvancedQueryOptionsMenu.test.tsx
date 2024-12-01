// src/components/__tests__/AdvancedQueryOptionsMenu.text.tsx
import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import AdvancedQueryOptionsMenu from "../AdvancedQueryOptionsMenu";

describe(AdvancedQueryOptionsMenu, () => {
    const setIsMenuOpen = jest.fn();
    const setRequest = jest.fn();

    const setup = () => {
        const { getByTestId } = render(
          <AdvancedQueryOptionsMenu
            isMenuOpen={true}
            setIsMenuOpen={setIsMenuOpen}
            setRequest={setRequest}
            submitRequest={false}
          />
        );
        return getByTestId;
    };

    beforeEach(() => {
        setIsMenuOpen.mockClear();
        setRequest.mockClear();
    });

    it("should force total source to display to be smaller than or equal to total source to collect", async () => {
        const getByTestId = setup();

        const totalSourcesToCollectInput = getByTestId("total-sources-to-collect-input") as HTMLInputElement;
        const totalSourcesToDisplayInput = getByTestId("total-sources-to-display-input") as HTMLInputElement;

        fireEvent.change(totalSourcesToDisplayInput, { target: { value: "15" } });
        fireEvent.change(totalSourcesToCollectInput, { target: { value: "10" } });

        await waitFor(() => {
            expect(totalSourcesToDisplayInput.value).toBe("10");
        });

        expect(totalSourcesToCollectInput.value).toBe("10");
    });

    it("should show a warning when the total platform ratios do not add up to 100", async () => {
        const getByTestId = setup();

        const newsRatioInput = getByTestId("news-ratio-input");
        const xRatioInput = getByTestId("x-ratio-input");
        const facebookRatioInput = getByTestId("facebook-ratio-input");
        const applyButton = getByTestId("apply-btn");

        fireEvent.change(facebookRatioInput, { target: { value: "40" } });
        fireEvent.change(newsRatioInput, { target: { value: "30" } });
        fireEvent.change(xRatioInput, { target: { value: "20" } });
        fireEvent.click(applyButton);
    
        await waitFor(() => {
            expect(screen.getByText("The total platform ratio percentage is under 100.")).toBeInTheDocument();
            expect(screen.getByText("Please adjust the platform ratio percentage to apply the new changes.")).toBeInTheDocument();
        });
    });
    
    it("should submit the request when the total platform ratios add up to 100", async () => {
        const getByTestId = setup();
    
        const newsRatioInput = getByTestId("news-ratio-input");
        const xRatioInput = getByTestId("x-ratio-input");
        const facebookRatioInput = getByTestId("facebook-ratio-input");
        const applyButton = getByTestId("apply-btn");

        fireEvent.change(newsRatioInput, { target: { value: "40" } });
        fireEvent.change(facebookRatioInput, { target: { value: "40" } });
        fireEvent.change(xRatioInput, { target: { value: "20" } });
        fireEvent.click(applyButton);
        
        await waitFor(() => {
            expect(setRequest).toHaveBeenCalledTimes(1);
        });
    });
});