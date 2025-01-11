import { SeparatorIn } from "../SeparatorIn";
import { SeparatorOut } from "../SeparatorOut";

export const Contact = () => {
  return (
    <div className="flex flex-col items-center justify-between sm:flex-row sm:items-start page-margins">
      <div className="m-4 w-full sm:w-1/2 text-white">
        <h3 className="mb-6 font-heading font-bold h3-text sm:h4-text">
          Do you want to get in touch?
        </h3>

        <p className="font-sans leading-[16px] ">
          Then you can fill out this form or <br />
          <br />
          <span className="flex justify-start items-center gap-1">
          <img src={"/mail-svgrepo-com.svg"} alt="Icon" className="w-6 h-6" />
          mail@jckl.dev
          </span>
          <br />
          I'm thrilled to hear from you!
        </p>
      </div>

      <form
        className="m-4 w-full font-sans sm:w-1/2"
        name="contact"
        method="POST"
        data-netlify="true"
      >
        <input type="hidden" name="form-name" value="contact" />
        <input
          type="hidden"
          name="subject"
          value="New email from %{formName} (%{submissionId})"
        />
        <div className="flex justify-center items-end gap-3 mb-3">
          <div className="relative w-5/12">
            <label htmlFor="name" className="block mb-1.5 text-white ">Your Name:</label>
            <input
              // placeholder="Enter your full name"
              className="w-full rounded-lg p-2 xl:p-4 text-primary font-medium focus:bg-primary focus:text-white"
              type="text"
              name="name"
            />
          </div>
          <div className="relative w-7/12">
            <label htmlFor="email" className="block mb-1.5 text-white">Your Email:</label>
            <input
              // placeholder="Enter your email address"
              className="w-full rounded-lg p-2 xl:p-4 text-primary font-medium focus:bg-primary focus:text-white"
              type="email"
              name="email"
            />
          </div>
        </div> 
        <label htmlFor="message" className="block mb-1 text-white">Your Message:</label>
        <textarea
          // placeholder="Type your message here"
          className="mb-3 w-full rounded-lg pb-10 pl-2 pt-2 xl:pb-24 xl:pl-4 xl:pt-4 text-primary font-medium focus:bg-primary focus:text-white"
          name="message"
        ></textarea>
        <button
          className="w-full rounded-lg border-2 p-2 text-white xl:p-4 hover:bg-secondary"
          type="submit"
        >
          <div className="flex justify-center items-center gap-1">
            Send Message  
            <img src={"/send-svgrepo-com.svg"} alt="Icon" className="w-6 h-6 text-white" />
          </div>
        </button>
      </form>
    </div>
  );
};
