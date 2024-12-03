import { Locator, Page } from '@playwright/test';
import config from 'config';

export default class ReportPage {

    public readonly causeOfInjuryOrNearMissField: Locator;
    public readonly causeOfInjuryOrNearMissFieldDiv: Locator;
    public readonly chatBoxField: Locator;
    public readonly chatMessageBoxes: Locator;
    public readonly dateAndTimeField: Locator;
    public readonly descriptionTextarea: Locator;
    public readonly descriptionTextareaDiv: Locator;
    public readonly fileInput: Locator;
    public readonly ifOtherTextarea: Locator;
    public readonly ifOtherTextareaDiv: Locator;
    public readonly locationField: Locator;
    public readonly locationFieldDiv: Locator;
    public readonly nameOfPersonInvolvedField: Locator;
    public readonly personCategoryField: Locator;
    public readonly personCategoryFieldDiv: Locator;
    public readonly spinners: Locator;
    public readonly submitButton: Locator;
    public readonly successHeader: Locator;
    public readonly toast: Locator;
    public readonly topImage: Locator;
    public readonly topText: Locator;
    public readonly typeField: Locator;
    public readonly typeFieldDiv: Locator;
    private readonly dropdown: Locator;
    private readonly dropdownOption: (option: string) => Locator;
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.spinners = this.page.getByRole('progressbar');

        this.topImage = this.page.locator('img[alt="Vatix logo"]');
        this.topText = this.page.locator('h2');

        this.dateAndTimeField = this.page.getByPlaceholder('DD/MM/YYYY hh:mm');
        this.locationFieldDiv = this.page.getByTestId('Location').locator('> div > div');
        this.locationField = this.locationFieldDiv.locator('input');
        this.typeFieldDiv = this.page.getByTestId('Type').locator('> div > div');
        this.typeField = this.typeFieldDiv.locator('input');
        this.descriptionTextarea = this.page.locator('textarea[placeholder="Description"]');
        this.descriptionTextareaDiv = this.descriptionTextarea.locator('..');
        this.nameOfPersonInvolvedField = this.page.locator('input[placeholder="Name of person involved"]');
        this.personCategoryFieldDiv = this.page.getByTestId('Person category');
        this.personCategoryField = this.personCategoryFieldDiv.locator('input');

        this.causeOfInjuryOrNearMissFieldDiv =
            this.page.getByTestId('Cause of Injury or Near Miss').locator('> div > div');
        this.causeOfInjuryOrNearMissField = this.causeOfInjuryOrNearMissFieldDiv.locator('input');

        this.ifOtherTextarea = this.page.locator('textarea[placeholder="If other, please specify cause"]');
        this.ifOtherTextareaDiv = this.ifOtherTextarea.locator('..');

        this.submitButton = this.page.locator('button#submit_button');

        this.chatBoxField = this.page.locator('p[contenteditable="true"]');
        this.chatMessageBoxes = this.page.locator('p#comment-created-by-logged-in-user');
        this.fileInput = this.page.locator('input[type="file"]');

        this.dropdown = this.page.locator('div[role="presentation"]');
        this.dropdownOption =
            (option: string) => this.dropdown.locator('li').getByText(`${option}`);

        this.toast = this.page.locator('div[role="alert"]');
        this.successHeader = this.page.locator('h1');
    }

    async clickSubmitButton(): Promise<void> {
        await this.submitButton.click();
    }

    async fillDateAndTimeField(dateAndTime: string): Promise<void> {
        await this.dateAndTimeField.fill(dateAndTime);
    }

    async fillDescription(description: string): Promise<void> {
        await this.descriptionTextarea.fill(description);
    }

    async fillNameOfPersonInvolvedField(name: string): Promise<void> {
        await this.nameOfPersonInvolvedField.fill(name);
    }

    async navigate(): Promise<void> {
        await this.page.goto(config.get('url'));
    }

    async selectAnotherCauseOfInjuryOrNearMiss(cause: string): Promise<void> {
        await this.dropdownOption(cause).click();
    }

    async selectCauseOfInjuryOrNearMiss(cause: string): Promise<void> {
        await this.causeOfInjuryOrNearMissFieldDiv.click();
        await this.dropdownOption(cause).click();
    }

    async selectLocation(location: string): Promise<void> {
        await this.locationFieldDiv.click();
        await this.dropdownOption(location).click();
        await this.dropdown.waitFor({ state: 'hidden' });
    }

    async selectPersonCategory(category: string): Promise<void> {
        await this.personCategoryFieldDiv.click();
        await this.dropdownOption(category).click();
        await this.dropdown.waitFor({ state: 'hidden' });
    }

    async selectType(type: string): Promise<void> {
        await this.typeFieldDiv.click();
        await this.dropdownOption(type).click();
        await this.dropdown.waitFor({ state: 'hidden' });
    }

    async sendChatMessage(message: string): Promise<void> {
        await this.chatBoxField.fill(message);
        await this.page.keyboard.press('Enter');
    }
}