import { addNewDocument } from "../../firebase/server";

async function CreateGroupModal(userID, description) {
    const userIDs = [userID];

    const newGroup = {
        Name: description,
        Num_Expense: 0,
        Num_Friends: 1,
        Status: "Unresolved",
        UserID: userIDs,
    };

    try {
        // Call addNewDocument and await its result
        const docId = await addNewDocument("Group", newGroup);
        return docId; // Return the document ID
    } catch (error) {
        console.error("Error creating group:", error);
        return null; // Return null or handle the error appropriately
    }
}

export default CreateGroupModal;
