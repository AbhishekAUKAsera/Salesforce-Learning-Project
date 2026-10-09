// import necessary modules and Apex methods
/*
This Lightning Web Component (LWC) is designed to generate and automatically download a richly formatted Microsoft Word document (.docx) directly from the user's browser.

It extracts data from a Salesforce Account and its related Contacts, formatting that data into a professional document using a third-party JavaScript library called docx.js.

Here is a breakdown of what this code is trying to achieve and how it accomplishes it.

The "What": Objectives of the Code
Client-Side Document Generation: Instead of using server resources (Apex) to build a file, it offloads the heavy lifting to the user's browser using docx.js.

Data Integration: It merges live Salesforce data (Account Name, Base64 Images, Contact details) into the document template.

Feature Demonstration: The code acts as a comprehensive showcase of docx.js capabilities, implementing advanced Word features like Tables of Contents, custom styling, repeating table headers, page numbers, and right-to-left text.

The "How": Step-by-Step Code Explanation
1. Imports & Setup
The file starts by importing the necessary LWC modules, the loadScript utility to load external libraries, and two Apex methods (getAllRelatedContacts and getAccountDetails) to fetch data from Salesforce.

@api recordId: This exposes the component to the Salesforce record page, automatically capturing the ID of the Account the user is currently viewing.

2. Component Initialization (connectedCallback)
When the component loads on the screen, the connectedCallback method fires automatically.

It uses loadScript to fetch the docx.js library from Salesforce Static Resources (docxImport).

Once successfully loaded, it sets docxInitialized = true and calls renderButtons() to unhide the UI buttons, ensuring the user cannot click "Generate" before the library is ready.

3. Fetching Salesforce Data (startDocumentGeneration)
When the user triggers the document generation (likely via a button click in the HTML), this method executes.

It acts as a safeguard, aborting if docx.js isn't loaded.

It uses Promise.all to call both Apex methods concurrently. This is highly efficient, as it fetches the Account details and Contact list at the same time rather than waiting for one to finish before starting the other.

Once both datasets are returned, it passes them into the buildDocument method.

4. Building the Document (buildDocument)
This is the core engine of the component. It uses the docx.js API to construct the file section by section:

Setup & Styling: It initializes a new Document object and defines a central "stylesheet" (font sizes, bolding, line spacing) and numbering configurations (Roman numerals and Decimals).

Table of Contents: It generates an automatic Table of Contents that links to heading levels 1 and 2.

Dynamic Data Insertion (Account & Contacts):

It creates intro text featuring the Account's Name.

It dynamically generates two tables using loops (contacts.forEach): a 2-column table and a 4-column table detailing the Contacts' names, emails, and phone numbers.

Image Processing: If the Account data includes an image (account.ImageBase64), it cleans the Base64 string and converts it into a binary format (using the helper method _base64ToArrayBuffer) so docx.js can embed it into the Word file.

Advanced Formatting Examples: The method then appends several new pages (addSection) to demonstrate specific formatting:

Roman & Decimal numbered lists.

Custom Headers and Footers with dynamic page numbering (e.g., "Page 1 of 5").

Right-to-Left (BiDi) text capabilities.

Paragraphs and tables that intentionally split across multiple pages.

A massive 100-row table designed to show how to force a table header to repeat on every new page.

5. Packing and Downloading
Once the virtual document is fully structured, the code converts it into a downloadable file:

Packer.toBase64String(doc): Compresses the document object into a base64 string.

It creates a raw data URL with the correct MIME type for Word documents.

It creates a hidden <a> HTML tag, assigns a sanitized version of the Account Name as the file name (e.g., acme_corp_details.docx), attaches the data URL, and simulates a click (link.click()). This forces the user's browser to instantly download the file.

6. Helper Methods
_createTextRun: A shortcut function to standardizing text formatting (Calibri, size 20, bold) without rewriting the configuration object every time.

_base64ToArrayBuffer: Browsers handle images in base64 strings, but file-generation libraries usually require raw binary data (ArrayBuffer). This method bridges that gap by decoding the base64 string and mapping it to a byte array.

Do you need help writing the corresponding Apex class (ContactGrabber) or the HTML template to make this component fully functional?
*/
import { LightningElement, api } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import docxImport from '@salesforce/resourceUrl/docxjs';
import getAllRelatedContacts from '@salesforce/apex/ContactGrabber.getAllRelatedContacts';
import getAccountDetails from '@salesforce/apex/ContactGrabber.getAccountDetails';

export default class WordDocGenerator extends LightningElement {

    // recordId of the Account to generate the document for
    @api recordId;
    // URL to download the generated .docx file
    downloadURL;
    // Flag to check if docx.js is loaded
    docxInitialized = false;

    // No border style for table cells
    _noBorder = {
        top: { style: 'none', size: 0, color: 'FFFFFF' },
        bottom: { style: 'none', size: 0, color: 'FFFFFF' },
        left: { style: 'none', size: 0, color: 'FFFFFF' },
        right: { style: 'none', size: 0, color: 'FFFFFF' }
    };

    /**
     * @description ConnectedCallback Lifecycle is called automatically by the Lightning Web Component framework when the component is initialized.
     * It uses the `loadScript` function to load the docx.js library from a static resource.
     * If the library loads successfully, it sets the `docxInitialized` flag to true and calls `renderButtons` to unhide the controls.
     * If there is an error loading the library, it logs the error to the console.
     * @returns {Promise<void>} A promise that resolves when the script is loaded.
     */

    async connectedCallback(){
        try{
            //Load the docx.js library
            await loadScript(this, docxImport);
            this.docxInitialized = true;
            this.renderButtons();

        }catch(error){
            console.error('Error loading docx library:', error);
        }
    }
    /**
     * @description renderButtons method renders the buttons by removing the 'hidden' class from elements with the 'hidden' class.
     * This method is called after the docx.js library is successfully loaded.
     * It ensures that the buttons for generating the document are visible to the user.
     * @returns {void}
     */
    renderButtons() {
        const elems = this.template.querySelectorAll('.hidden');
        elems.forEach((e) => e.classList.remove('hidden'));
    }

    /**
     * @description startDocumentGeneration method starts the document generation process by fetching related contacts and account details using Apex methods.
     * It first checks if the docx.js library is loaded. If not, it logs an error message.
     * @returns {void}
     */
    startDocumentGeneration() {
        // Check if docx.js is loaded
        if (!this.docxInitialized) {
            // If not loaded, log an error and return
            console.error('docx.js is not loaded yet.');
            return;
        }

        // Call Apex methods to get related contacts and account details
        // Use Promise.all to fetch both concurrently
        Promise.all([
            getAllRelatedContacts({ acctId: this.recordId }),
            getAccountDetails({ acctId: this.recordId })
        ])
            // Handle the results of both Apex calls
            .then(([contacts, accounts]) => {
                // build the Word document with the fetched data
                this.buildDocument(contacts, accounts);
            })
            // Handle any errors that occur during the Apex calls
            .catch((err) => {
                console.error('Error fetching data from Apex:', err);
            });
    }

    /** 
     * @description buildDocument method constructs a Word document using the docx.js library.
     * It creates a document with custom styles, a table of contents, and various sections including account details and contact information.
     * The document includes:
     * – A table of contents on the first page
     * – An account details section with contact tables (2 fields and 4 fields)
     * – An account image if available
     * – Examples of numbered lists (Roman and Decimal)
     * – A section with a header and footer containing page numbers
     * – Right-to-left text examples
     * – A paragraph split across two pages
     * – A table split across two pages
     * – A new example of a table with many rows that spans multiple pages, with a repeating header
     * @param {Array} contacts – An array of contact objects related to the account.
     * @param {Array} account – An object containing account details.
     * @returns {void}
    */
    buildDocument(contacts, account) {
        // Intialize docx.js classes which will be used to create the document
        const {
            Document,
            Paragraph,
            TextRun,
            HeadingLevel,
            AlignmentType,
            Table,
            TableRow,
            TableCell,
            TableOfContents,
            StyleLevel,
            Media,
            Header,
            Footer,
            PageNumber,
            PageNumberFormat,
            WidthType
        } = window.docx;

        // 1) Create a new Document instance with custom styles and numbering configurations
        // Define styles for headings, paragraphs, and lists
        const doc = new Document({
            styles: {
                // Define the heading and paragraph styles
                paragraphStyles: [
                    // Heading1 style with custom font, size, underline, alignment, and spacing
                    {
                        id: 'Heading1',
                        name: 'Heading 1',
                        basedOn: 'Normal',
                        next: 'Normal',
                        quickFormat: true,
                        run: {
                            font: 'Calibri',
                            size: 52,
                            bold: true,
                            color: '000000',
                            underline: { type: window.docx.UnderlineType.SINGLE, color: '000000' }
                        },
                        paragraph: { alignment: AlignmentType.CENTER, spacing: { line: 340 } }
                    },
                    // Heading2 style with custom font, size, bold, and spacing
                    {
                        id: 'Heading2',
                        name: 'Heading 2',
                        basedOn: 'Normal',
                        next: 'Normal',
                        quickFormat: true,
                        run: { font: 'Calibri', size: 26, bold: true },
                        paragraph: { spacing: { line: 340 } }
                    },
                    // Normal paragraph style with custom font, size, bold and spacing like line height, before and after spacing
                    // Tab stops positions like rightTabStop and leftTabStop 
                    {
                        id: 'NormalParaBold',
                        name: 'Normal Para Bold',
                        basedOn: 'Normal',
                        next: 'Normal',
                        quickFormat: true,
                        run: { font: 'Calibri', size: 26, bold: true },
                        paragraph: {
                            spacing: { line: 276, before: 20 * 72 * 0.1, after: 20 * 72 * 0.05 },
                            rightTabStop: window.docx.TabStopPosition.MAX,
                            leftTabStop: 453.543307087
                        }
                    },
                    // Normal paragraph style with custom font, size, alignment and spacing like line height, before and after spacing
                    {
                        id: 'NormalPara',
                        name: 'Normal Para',
                        basedOn: 'Normal',
                        next: 'Normal',
                        quickFormat: true,
                        run: { font: 'Calibri', size: 26 },
                        paragraph: {
                            alignment: AlignmentType.JUSTIFIED,
                            spacing: { line: 276, before: 20 * 72 * 0.1, after: 20 * 72 * 0.05 }
                        }
                    },
                    // List Paragraph style with custom font, size, and quick format
                    {
                        id: 'ListParagraph',
                        name: 'List Paragraph',
                        basedOn: 'Normal',
                        quickFormat: true
                    }
                ]
            },
            // Define numbering configurations and styles for Roman and Decimal
            numbering: {
                // Configurations for Roman and Decimal styles
                config: [
                    {
                        // Roman numbering configuration
                        reference: 'roman-numbering',
                        // Levels for Roman numbering
                        levels: [
                            {
                                level: 0, // Level 0 for Roman numbering
                                format: 'upperRoman', // Use uppercase Roman numerals
                                text: '%1', // Placeholder for numbering text
                                alignment: AlignmentType.START, // Align to start
                                style: {
                                    // Paragraph style for Roman numbering
                                    paragraph: { indent: { left: 720, hanging: 260 } }
                                }
                            }
                        ]
                    },
                    {
                        // Decimal numbering configuration
                        reference: 'decimal-numbering',
                        // Levels for Decimal numbering
                        levels: [
                            {
                                level: 0, // Level 0 for Decimal numbering
                                format: 'decimal', // Use decimal numbering
                                text: '%1', // Placeholder for numbering text
                                alignment: AlignmentType.START, // Align to start
                                style: {
                                    // Paragraph style for Decimal numbering
                                    paragraph: { indent: { left: 720, hanging: 260 } }
                                }
                            }
                        ]
                    }
                ]
            }
        });

        // 2) Add a custom heading for the document
        // Example of using heading level 1 with custom text and alignment
        // Defined Table of Contents Heading
        const introHeading2 = new Paragraph({
            text: 'Table of Contents',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
        });

        // 2a) Create a Table of Contents with custom styles and hyperlinking
        const toc = new TableOfContents('Table of Contents', {
            hyperlink: true,
            headingStyleRange: '1-5',
            stylesWithLevels: [new StyleLevel('Heading1', 1), new StyleLevel('Heading2', 2)]
        });
        // Add the Table of Contents to the document
        doc.addSection({
            children: [introHeading2,toc]
        });

        // 3) Add a section for Account Details and Contacts
        // Example of using heading level 2 with account name fetched from Apex
        const introHeading = new Paragraph({
            text: `Account Details: ${account.Name}`,
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
        });

        // 3a) Example of a paragraph with a text run containing additional information
        const introPara = new Paragraph({
            children: [
                // Add a text run with custom text and formatting
                new TextRun('This document contains all relevant account and contact information.'),
                // Add a bold text run with a tab character
                new TextRun({ text: '\tGenerated with LWC + docx.js.', bold: true })
            ],
            // Set the style for the paragraph
            style: 'NormalPara'
        });

        // 3b) Build a 2-column contact table (First Name / Last Name)
        // Example of using a table with two columns for contact information
        const twoFieldRows = [];
        twoFieldRows.push(
            new TableRow({
                tableHeader: true,
                children: [
                    new TableCell({
                        children: [new Paragraph('First Name')],
                        borders: this._noBorder,
                        style: 'NormalParaBold'
                    }),
                    new TableCell({
                        children: [new Paragraph('Last Name')],
                        borders: this._noBorder
                    })
                ]
            })
        );

        // Loop through the contacts array to create table rows
        contacts.forEach((ct) => {
            twoFieldRows.push(
                new TableRow({
                    children: [
                        new TableCell({
                            // Create a paragraph with a text run for the first name
                            children: [new Paragraph({ children: [this._createTextRun(ct.FirstName)] })]
                        }),
                        new TableCell({
                            // Create a paragraph with a text run for the last name
                            children: [new Paragraph({ children: [this._createTextRun(ct.LastName)] })]
                        })
                    ]
                })
            );
        });

        // Create the table with the defined rows and set its width to 100% of the page
        const twoFieldTable = new Table({
            width: { size: 100, type: WidthType.PERCENTAGE }, // full page width
            rows: twoFieldRows, // set the rows to twoFieldRows defined above
        });

        // 3c) Build a 4-column contact table (First Name / Last Name / Email / Phone)
        // Example of using a table with four columns for contact information
        const fourFieldRows = [];
        fourFieldRows.push(
            new TableRow({
                tableHeader: true,
                children: [
                    new TableCell({
                        // Create a paragraph with a text run for the first name header
                        children: [new Paragraph('First Name')],
                        // Set no borders for the cell
                        borders: this._noBorder
                    }),
                    new TableCell({
                        // Create a paragraph with a text run for the last name header
                        children: [new Paragraph('Last Name')],
                        // Set no borders for the cell
                        borders: this._noBorder
                    }),
                    new TableCell({
                        // Create a paragraph with a text run for the email header
                        children: [new Paragraph('Email')],
                        // Set no borders for the cell
                        borders: this._noBorder
                    }),
                    new TableCell({
                        // Create a paragraph with a text run for the phone header
                        children: [new Paragraph('Phone')],
                        // Set no borders for the cell
                        borders: this._noBorder
                    })
                ]
            })
        );

        // Loop through the contacts array to create table rows
        contacts.forEach((ct) => {
            fourFieldRows.push(
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph({ children: [this._createTextRun(ct.FirstName)] })]
                        }),
                        new TableCell({
                            children: [new Paragraph({ children: [this._createTextRun(ct.LastName)] })]
                        }),
                        new TableCell({
                            children: [new Paragraph({ children: [this._createTextRun(ct.Email)] })]
                        }),
                        new TableCell({
                            children: [new Paragraph({ children: [this._createTextRun(ct.Phone)] })]
                        })
                    ]
                })
            );
        });

        // Create the table with the defined rows and set its width to 100% of the page
        const fourFieldTable = new Table({
            width: { size: 100, type: WidthType.PERCENTAGE }, // full page width
            rows: fourFieldRows, // set the rows to fourFieldRows defined above
        });

        // 3d) Add Image from Account (if available)
        // Example of adding an image to the document from account attachments.
        // Define a paragraph to hold the image if it exists
        let imagePara;
        // Check if the account has an image in Base64 format
        if (account.ImageBase64) {
            // If the image exists, convert the Base64 string to an ArrayBuffer
            let base64Str = account.ImageBase64;
            // If the Base64 string starts with 'data:image', remove the prefix
            if (base64Str.startsWith('data:image')) {
                // Remove the data URL prefix to get the raw Base64 string
                base64Str = base64Str.split(',')[1];
            }
            // Remove any whitespace characters from the Base64 string
            base64Str = base64Str.replace(/\s/g, '');
            // Convert the Base64 string to an ArrayBuffer
            const imgBuffer = this._base64ToArrayBuffer(base64Str);
            // Add the image to the document using Media.addImage and set its dimensions as 600 height and 300 width
            const insertedImg = Media.addImage(doc, imgBuffer, 600, 300);
            // Create a paragraph to hold the inserted image with spacing after it
            imagePara = new Paragraph({ children: [insertedImg],spacing: { after: 800 }, });
        }

        // 3e) Add this “Account + Contacts” section (starts on page 2)
        // Create a new section for the account and contacts information
        const sectionAccountChildren = [
            // Add the intro heading and paragraph to the section
            introHeading,
            // Add the intro paragraph with custom text runs
            introPara,
            // Add the two-field and four-field contact tables to the section
            new Paragraph({ text: 'Contacts List (2 fields)', style: 'NormalParaBold', spacing: { after: 100 }, }),
            // Add the two-field table to the section
            twoFieldTable,
            // Add a paragraph with spacing after it, to put some space between the table and next content
            new Paragraph({ text: '', style: 'NormalParaBold', spacing: { after: 100 }, }),
            // Add a heading for the four-field contacts list
            new Paragraph({ text: 'Contacts List (4 fields)', heading: HeadingLevel.HEADING_2, spacing: { after: 100 }, }),
            // Add the four-field table to the section
            fourFieldTable,
            // Add a paragraph with spacing after it, to put some space between the table and next content
            new Paragraph({ text: '', style: 'NormalParaBold',spacing: { after: 100 }, }),
        ];

        // If an image was added, include it in the section
        if (imagePara) {
            // Add a heading for the account image and the image paragraph
            sectionAccountChildren.push(new Paragraph({ text: 'Account Image', heading: HeadingLevel.HEADING_2, spacing: { after: 400 } }));
            // Add the image paragraph to the section
            sectionAccountChildren.push(imagePara);
        }

        // Add the section to the document with the account details and contacts
        doc.addSection({
            children: sectionAccountChildren
        });

        // 4) Example 1: Roman-Numbered List (each example on its own page)
        doc.addSection({
            children: [
                // Add a heading for the Roman-numbered list example
                new Paragraph({ text: 'Example: Roman-Numbered List', heading: HeadingLevel.HEADING_1, pageBreakBefore: true }),
                // Add paragraphs with Roman numbering for each item
                new Paragraph({
                    text: 'Item I',
                    numbering: { reference: 'roman-numbering', level: 0 }
                }),
                // Add another item with Roman numbering
                new Paragraph({
                    text: 'Item II',
                    numbering: { reference: 'roman-numbering', level: 0 }
                })
            ]
        });

        // 5) Example 2: Decimal-Numbered List (on its own page)
        doc.addSection({
            children: [
                // Add a heading for the Decimal-numbered list example
                new Paragraph({ text: 'Example: Decimal-Numbered List', heading: HeadingLevel.HEADING_1, pageBreakBefore: true }),
                // Add paragraphs with Decimal numbering for each step
                new Paragraph({
                    text: 'Step 1 — Gather ingredients',
                    numbering: { reference: 'decimal-numbering', level: 0 }
                }),
                // Add another step with Decimal numbering
                new Paragraph({
                    text: 'Step 2 — Mix ingredients',
                    numbering: { reference: 'decimal-numbering', level: 0 }
                }),
                // Add another step with Decimal numbering
                new Paragraph({
                    text: 'Step 3 — Bake at 350°F',
                    numbering: { reference: 'decimal-numbering', level: 0 }
                })
            ]
        });

        // 6) Example 3: Header & Footer with Page Numbers (on its own page)
        doc.addSection({
            // Set the header for the section
            headers: {
                // Default header for the section
                default: new Header({
                    children: [
                        // Add a paragraph with the company name and current page number
                        new Paragraph({
                            children: [
                                // Add a text run with the company name
                                new TextRun('My Company'),
                                // Add a text run with the current page number
                                new TextRun({ children: [' – Page ', PageNumber.CURRENT] })
                            ]
                        })
                    ]
                })
            },
            // Set the footer for the section
            footers: {
                default: new Footer({
                    children: [
                        // Add a centered paragraph with the text and page numbers
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                // Add a text run 
                                new TextRun('© Confidential'),
                                // Add a text run with the current page number and total pages
                                new TextRun({ children: [' | Page ', PageNumber.CURRENT, ' of ', PageNumber.TOTAL_PAGES] })
                            ]
                        })
                    ]
                })
            },
            // Set the page numbering format and start from page 1
            properties: {
                pageNumberStart: 1,
                pageNumberFormatType: PageNumberFormat.DECIMAL
            },
            children: [
                // Add a heading for the header/footer example
                new Paragraph({ text: 'Example: Header/Footer', heading: HeadingLevel.HEADING_1, pageBreakBefore: true }),
                // Add a paragraph with a description of the header/footer example
                new Paragraph({ text: 'This section demonstrates a custom header and footer with dynamic page numbers.' })
            ]
        });

        // 7) Example 4: Right-to-Left (BiDi) Text (on its own page)
        doc.addSection({
            children: [
                // Add a heading for the Right-to-Left text example
                new Paragraph({ text: 'Example: Right-to-Left Text', heading: HeadingLevel.HEADING_1, pageBreakBefore: true }),
                // Add paragraphs with Right-to-Left text runs
                new Paragraph({
                    // Set the paragraph to be bidirectional (RTL)
                    bidirectional: true,
                    children: [
                        // Add a text run with Right-to-Left text and bold formatting
                        new TextRun({ text: 'hello world', rightToLeft: true, bold: true })
                    ]
                }),
                new Paragraph({
                    // Set the paragraph to be bidirectional (RTL)
                    bidirectional: true,
                    children: [
                        // Add a text run with Right-to-Left text and italics formatting
                        new TextRun({ text: 'This is text in the right-to-left border', italics: true, rightToLeft: true })
                    ]
                })
            ]
        });

        // 8) Example 5: Paragraph Split Across Two Pages

        // 8a) Create the first part of a long paragraph that will be split across two pages
        const longTextPart1 = new Paragraph({
            // Add a long paragraph that will be split across two pages
            text:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada.',
            // Use the NormalPara style defined earlier
            style: 'NormalPara'
        });

        // 8b) Create a second part of the long paragraph that will continue on the next page
        const longTextPart2 = new Paragraph({
            // Add a continuation of the long paragraph
            text:
                'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
            // Use the NormalPara style defined earlier
            style: 'NormalPara',
            // Set page break before this paragraph to ensure it starts on a new page
            // This will ensure that the second part of the paragraph starts on a new page
            // when the first part is too long to fit on the current page
            pageBreakBefore: true
        });

        // Add the section with the split paragraph to the document
        doc.addSection({
            children: [
                // Add a heading for the paragraph split example
                new Paragraph({ text: 'Example: Paragraph Split Across Pages', heading: HeadingLevel.HEADING_1, pageBreakBefore: true }),
                // Add the first part of the long paragraph
                longTextPart1,
                // Add a paragraph with a description of the split paragraph example
                longTextPart2
            ]
        });

        // 9) Example 6: Table Split Across Two Pages

        // 9a) First half of the table
        // Example of using a table with two columns and multiple rows
        const tablePart1Rows = [];
        tablePart1Rows.push(
            new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph('Header A')], borders: this._noBorder }),
                    new TableCell({ children: [new Paragraph('Header B')], borders: this._noBorder })
                ]
            })
        );
        tablePart1Rows.push(
            new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph({ children: [this._createTextRun('Row 1 – A')] })] }),
                    new TableCell({ children: [new Paragraph({ children: [this._createTextRun('Row 1 – B')] })] })
                ]
            })
        );
        tablePart1Rows.push(
            new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph({ children: [this._createTextRun('Row 2 – A')] })] }),
                    new TableCell({ children: [new Paragraph({ children: [this._createTextRun('Row 2 – B')] })] })
                ]
            })
        );
        const tablePart1 = new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: tablePart1Rows
        });

        // 9b) Second half of the table
        const tablePart2Rows = [];
        tablePart2Rows.push(
            new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph({ children: [this._createTextRun('Row 3 – A')] })] }),
                    new TableCell({ children: [new Paragraph({ children: [this._createTextRun('Row 3 – B')] })] })
                ]
            })
        );
        tablePart2Rows.push(
            new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph({ children: [this._createTextRun('Row 4 – A')] })] }),
                    new TableCell({ children: [new Paragraph({ children: [this._createTextRun('Row 4 – B')] })] })
                ]
            })
        );
        const tablePart2 = new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: tablePart2Rows
        });

        doc.addSection({
            children: [
                new Paragraph({ text: 'Example: Table Split Across Pages', heading: HeadingLevel.HEADING_1, pageBreakBefore: true }),
                tablePart1,
                new Paragraph({ text: '', pageBreakBefore: true }),
                tablePart2
            ]
        });

        // 10) New Example 7: Table Content Split Across Pages with Repeating Header
        // Build a table with many rows so it spans multiple pages.
        // Use `tableHeader: true` on the first row to repeat it.
        const manyRows = [];
        // Header row with tableHeader: true
        manyRows.push(
            new TableRow({
                tableHeader: true,
                children: [
                    new TableCell({
                        children: [new Paragraph('Item')],
                        borders: this._noBorder
                    }),
                    new TableCell({
                        children: [new Paragraph('Description')],
                        borders: this._noBorder
                    })
                ]
            })
        );
        // Example data rows (e.g., 100 rows)
        for (let i = 1; i <= 100; i++) {
            manyRows.push(
                new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                new Paragraph({
                                    children: [this._createTextRun(`Item ${i}`)]
                                })
                            ]
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    children: [this._createTextRun(`Description for item ${i}, which may be long enough to wrap or push rows to the next page.`)]
                                })
                            ]
                        })
                    ]
                })
            );
        }
        const manyRowsTable = new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: manyRows
        });

        doc.addSection({
            children: [
                new Paragraph({ text: 'Example: Table Content Split Across Pages', heading: HeadingLevel.HEADING_1, pageBreakBefore: true }),
                new Paragraph({ text: 'Below is a table whose content spans multiple pages. Notice how the header repeats on each new page.' }),
                manyRowsTable
            ]
        });

        // 11) Pack the document and produce a downloadable URL
        window.docx.Packer.toBase64String(doc)
            .then((b64) => {
                // Set the download URL to be used for downloading the document
                // The URL is prefixed with the MIME type for Word documents
                // This allows the browser to recognize it as a downloadable file
                // and handle it accordingly when the user clicks the download link
                this.downloadURL =
                    'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,' + b64;
                const dlLink = this.template.querySelector('.slds-hide');
                if (dlLink) {
                    dlLink.classList.remove('slds-hide');
                }
                // Create an <a> element, click it to download immediately
                const link = document.createElement('a');
                // Set the name of the account to be used in the file name and replace any invalid characters
                const safeName = account.Name.replace(/[^a-z0-9_\-]/gi, '_').toLowerCase();
                // Set the href and download attributes for the link
                link.href = this.downloadURL;
                // Set the download attribute to specify the file name
                link.download = `${safeName}_Details.docx`;

                // Append the link to the body, click it to trigger the download, and then remove it
                document.body.appendChild(link);
                // Trigger the download by simulating a click on the link
                link.click();
                // Remove the link from the document after the download
                document.body.removeChild(link);
            })
            .catch((err) => {
                console.error('Error generating .docx:', err);
            });
    }

    /**
     * @description Helper method to create a TextRun with custom formatting.
     * @param {string} text – The text to be included in the TextRun.
     * @returns {TextRun} – A TextRun object with the specified text and formatting.
     */
    _createTextRun(text) {
        return new window.docx.TextRun({
            text,
            bold: true,
            size: 20,
            font: 'Calibri'
        });
    }

    /**
     * @description Helper method to convert a Base64 string to an ArrayBuffer.
     * This is used to convert images from Base64 format to a format that can be used in the Word document.
     * @param {string} base64 – The Base64 string to be converted.
     * @returns {ArrayBuffer} – The converted ArrayBuffer.
     */
    _base64ToArrayBuffer(base64) {
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }
}