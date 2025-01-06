import { SeparatorIn } from "../test";
import { SeparatorOut } from "../test2";

export const Contact = () => {
  return (
    <>
      <SeparatorIn />
      <div className="relative text-white">
        <div className="-z-20 h-auto bg-primary w-full absolute inset-0"></div>
        <div className="sm:mx-18 mx-12 flex flex-col items-center justify-between sm:flex-row sm:items-start xl:mx-48">
          <div className="m-4 w-full sm:w-1/2">
            <h3 className="mb-6 font-heading text-4xl font-bold xl:text-6xl">
              Do you want to get in touch?
            </h3>

            <p className="font-sans leading-[16px] xl:text-lg">
              Then you can fill out this form or <br />
              <br />
              <div className="flex justify-start items-center gap-1">
              <img src={"/mail-svgrepo-com.svg"} alt="Icon" className="w-6 h-6" />
              mail@jckl.dev
              </div>
              <br />
              I'm thrilled to hear from you!
            </p>
          </div>

          <form
            className="m-4 w-full font-sans text-black/75 sm:w-1/2 xl:text-lg"
            name="contact"
            method="POST"
            data-netlify="true"
          >
            <input
              type="hidden"
              name="subject"
              value="New email from %{formName} (%{submissionId})"
            />
            <p>
              <input
                placeholder="Full Name"
                className="mb-3 w-full rounded-lg p-2 xl:p-4"
                type="text"
                name="name"
              />
            </p>
            <p>
              <input
                placeholder="Your Email"
                className="mb-3 w-full rounded-lg p-2 xl:p-4"
                type="email"
                name="email"
              />
            </p>
            <p>
              <textarea
                placeholder="Your Message"
                className="mb-3 w-full rounded-lg pb-10 pl-2 pt-2 xl:pb-24 xl:pl-4 xl:pt-4"
                name="message"
              ></textarea>
            </p>
            <p>
              <button
                className="w-full rounded-lg border-2 p-2 text-white xl:p-4"
                type="submit"
              >
                <div className="flex justify-center items-center gap-1">
                  Send Message  
                  <img src={"/send-svgrepo-com.svg"} alt="Icon" className="w-6 h-6 text-white" />
                </div>
              </button>
            </p>
          </form>
        </div>
      </div>
      <SeparatorOut />
    </>
  );
};
