import StorySection from "./story-section";

export default function SectionCraft() {
  return (
    <StorySection
      index="04"
      coordinate="TOLERANCE 0.3MM"
      eyebrow="Craft"
      title={<>Precision in every surface</>}
      tone="dark"
      media={
        <video
          className="w-full h-full object-cover opacity-60"
          src="/media/factory-loop.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
      }
    >
      <p className="max-w-md font-body text-quartz/80 leading-relaxed">
        CNC calibration, hand-finishing and inspection under raking light —
        every slab is checked against the batch before it leaves the factory
        floor.
      </p>
    </StorySection>
  );
}
