import React, { useState } from "react";
import Modal from "react-modal";

interface IntroModalProps {
  onConfirm: () => void;
}

Modal.setAppElement("#root");

const customStyles = {
  overlay: {
    minHeight: "80vh",
    zIndex: "50",
  },
  content: {
    border: "none",
    padding: "2rem",
    maxWidth: "600px",
    width: "100%",
    maxHeight: "85vh",
    overflowY: "auto",
    backgroundColor: "white",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "20vh",
  },
};

const IntroModal = (props: IntroModalProps) => {
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const [ageConfirmed, setAgeConfirmed] = useState(false);

  const handleCloseModal = () => {
    if (ageConfirmed) {
      setModalIsOpen(false);
      props.onConfirm();
    } else {
      alert("Please confirm that you are 18 years or older.");
    }
  };

  const handleAgeConfirmation = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgeConfirmed(e.target.checked);
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={handleCloseModal}
      contentLabel="Welcome!"
      className="Modal"
      overlayClassName="Overlay"
      // @ts-ignore
      style={customStyles}
    >
      <div className="text-lg font-semibold text-gray-700">
        <h2 className="mb-4 text-2xl font-bold text-center text-blue-600">
          Welcome!
        </h2>
        <p className="mb-2">
          The goal of the site is to refine and enhance the automatically
          generated captions through your feedback.
        </p>
        <p className="mb-2">
          Explore the data by navigating the map on the top-left side of the
          screen.
        </p>
        <p className="mb-2">
          As you explore, the images displayed at the bottom-left side will be
          dynamically filtered.
        </p>
        <p className="mb-2">
          Click on any image to view it in a larger size and to read the
          associated captions on the right side.
        </p>
        <p className="mb-2">
          Feel free to propose edits to these captions or report an image if it
          is offensive, inappropriate, or violates copyright rules.
        </p>
        <p className="mb-2">
          Please note: Only logged-in users can propose edits or submit reports.
        </p>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="ageConfirmation"
            onChange={handleAgeConfirmation}
            className="w-4 h-4 mr-2 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="ageConfirmation" className="text-sm text-gray-600">
            I confirm that I am 18 years old or over
          </label>
        </div>
        <button
          onClick={handleCloseModal}
          className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Acknowledge and continue
        </button>
      </div>
    </Modal>
  );
};

export default IntroModal;
