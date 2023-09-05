import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { saveAs } from 'file-saver';
import { DocumentCreator } from './AssignmentGenerator'
import { Packer } from 'docx'


const AssignmentSetupComponent = () => {
	const generate = () => {
		const documentCreator = new DocumentCreator();
		const doc = documentCreator.create();

		Packer.toBlob(doc).then((blob) => {
			console.log(blob);
			saveAs(blob, 'example.docx');
			console.log('Document created successfully');
		});
	}
	return (
		<Box>
			Assignment Setup page
			<Button onClick={() => generate()}>
				Click here
			</Button>
		</Box>
	)
}

export default AssignmentSetupComponent
