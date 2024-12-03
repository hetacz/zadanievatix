import { expect, test } from '@playwright/test';
import ReportPage from '../src/pages/ReportPage';

test.describe('Verify the report page', () => {

    test.beforeEach(async ({ page }) => {
        const reportPage = new ReportPage(page);
        await reportPage.navigate();
        await Promise.all((await reportPage.spinners.all()).map(spinner => spinner.waitFor({ state: 'hidden' })));
    });

    test('Verify the report page basic elements', async ({ page }) => {
        const reportPage = new ReportPage(page);

        await expect(reportPage.topImage).toBeVisible();
        await expect(reportPage.topText).toHaveText('New Submission');

        await expect(reportPage.dateAndTimeField).toBeVisible();
        await expect(reportPage.locationField).toBeVisible();
        await expect(reportPage.typeField).toBeVisible();
        await expect(reportPage.descriptionTextarea).toBeVisible();
        await expect(reportPage.nameOfPersonInvolvedField).toBeVisible();
        await expect(reportPage.personCategoryField).toBeVisible();
        await expect(reportPage.submitButton).toBeDisabled();
        await expect(reportPage.chatBoxField).toBeVisible();
    });

    test('Try submitting a report with a date only', async ({ page }) => {
        const reportPage = new ReportPage(page);
        await reportPage.fillDateAndTimeField('01/01/2024 00:15');
        await expect(reportPage.submitButton).toBeEnabled();
        await reportPage.submitButton.click();
        await reportPage.toast.waitFor();
        await expect(reportPage.toast).toHaveText('You have to fill in all required fields.');
        await expect(reportPage.locationFieldDiv).toHaveAttribute('class', /Mui-error/);
        await expect(reportPage.typeFieldDiv).toHaveAttribute('class', /Mui-error/);
        await expect(reportPage.descriptionTextareaDiv).toHaveAttribute('class', /Mui-error/);
    });

    test('Submit a report with basic fields filled in', async ({ page }) => {
        const reportPage = new ReportPage(page);
        await reportPage.fillDateAndTimeField('01/01/2024 00:15');
        await reportPage.selectLocation('A2 Workshop');
        await expect(reportPage.locationField).toHaveAttribute('value', 'A2 Workshop');
        await reportPage.selectType('Fatality');
        await expect(reportPage.typeField).toHaveAttribute('value', 'Fatality');
        await reportPage.fillDescription('Test description');
        await expect(reportPage.submitButton).toBeEnabled();
        await reportPage.clickSubmitButton();
        await expect(reportPage.successHeader).toHaveText('Incident reported successfully!');
    });

    test('Verify the chat box', async ({ page }) => {
        const reportPage = new ReportPage(page);
        await reportPage.sendChatMessage('Test message');
        await expect(reportPage.chatMessageBoxes.last()).toHaveText('Test message');
        await reportPage.sendChatMessage('Another test message');
        await expect(reportPage.chatMessageBoxes.last()).toHaveText('Another test message');
    });

    test('Select a Near Miss type', async ({ page }) => {
        const reportPage = new ReportPage(page);
        await reportPage.selectType('Near Miss');
        await expect(reportPage.causeOfInjuryOrNearMissField).toBeVisible();
        await expect(reportPage.ifOtherTextarea).toBeHidden();

        await test.step('Select "Lack of training" as the cause of injury or near miss', async () => {
            await reportPage.selectCauseOfInjuryOrNearMiss('Lack of training');
            await expect(reportPage.causeOfInjuryOrNearMissFieldDiv).toContainText('Lack of training');
        });

        await test.step('Select "Other" as the cause of injury or near miss', async () => {
            await reportPage.selectAnotherCauseOfInjuryOrNearMiss('Other');
            await expect(reportPage.causeOfInjuryOrNearMissFieldDiv).toContainText('Other');
            await expect(reportPage.ifOtherTextarea).toBeVisible();
        });
    });
});
