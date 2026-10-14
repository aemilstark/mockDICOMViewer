# JellyView 

A toy DICOM viewer written in pure Typescript. The core functionality of this project is to display the metadata and data of a mock DICOM file, as well as offering some tools for easy manipulation. In addition, it should illustrate good project organization and programming practices. 

For demonstrative purposes, actual DICOM files have been substituted for a toy model, which has been formally defined in its own interface. The app generates data to be displayed at run time, when an actual implementation would read these files in from outside the app. The mock DICOM file's structure is informed by that of the real DICOM file. 

Image processing is done on the programatic level, allowing for fine control and flexible implementation of new tools. These tools include some simple transformation controls. The app includes brightness and contrast sliders, in the form of Window Center and Window Width, as these are important for judging the relative HU values of different tissue. 

The entire app is encapsulated in a single HTML element called `dicom-viewer`, allowing for easy embeding into a larger project. Project files have also been organized within the source folder, with app files kept sepearte from the utility files. 

The dev environment uses Vite. It features many small Quality of Life features, to make future development seamless, including an extended .gitignore, and path aliasing. 

There is a single function which uses generics... because I know what those are. 

Google Gemini was used to generate code. 

## Installation and Execution

1. Install Node.js 
2. Navigate to the project folder in a command line terminal. 
3. Run `npm install`
4. Run `npm run build`
5. Run `npm run preview`

## Deployment 

[Deployed from github](https://aemilstark.github.io/mockDICOMViewer/)

## The Story

In response to a job listing in the field of medical imaging, requesting skill in pure Typescript, this project aims to show a proactive willingness to interact with a new domain as well as the ability to deliver well planned, organized and documented code. 

## Domain Research 

In order to make this app relevant to it's greater purpose it has to reflect the real technology it is mocking. To that end research was done on the actual DICOM file format. Exact properties of the file type was explained by [Innolitics](https://dicom.innolitics.com/ciods/raw-data/general-study/00080020). Comments in the DICOM interface show tags for the corresponding attribute in the real file. 

For the pixel data, research was done on the use of [Hounsfield units](https://www.kaggle.com/code/zyulin/ct-scans-dicom-files-windowing-explained). Pixel data is stored in a 16 bit format to mirror the actual file type. The generated data is meant to be a fun little coronal view of the chest cavity, with values correlating to real body structures. It has low values for lungs, medium to high values for the heart and soft tissue, and high values for ribs and spine. 

Youtube videos from subject experts were used to inform the need for brightness and contrast controls. 
