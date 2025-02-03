import React from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Alert,
  Link,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PageHeader from "../../components/shared/PageHeader";

const citations = [
  {
    title: "Open LLM Leaderboard v2",
    authors:
      "Clémentine Fourrier, Nathan Habib, Alina Lozovskaya, Konrad Szafer, Thomas Wolf",
    citation: `@misc{open-llm-leaderboard-v2,
  author = {Clémentine Fourrier and Nathan Habib and Alina Lozovskaya and Konrad Szafer and Thomas Wolf},
  title = {Open LLM Leaderboard v2},
  year = {2024},
  publisher = {Hugging Face},
  howpublished = "\\url{https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard}",
}`,
    type: "main",
  },
  {
    title: "Evaluation Framework",
    authors: "Leo Gao et al.",
    citation: `@software{eval-harness,
  author       = {Gao, Leo and Tow, Jonathan and Biderman, Stella and Black, Sid and DiPofi, Anthony and Foster, Charles and Golding, Laurence and Hsu, Jeffrey and McDonell, Kyle and Muennighoff, Niklas and Phang, Jason and Reynolds, Laria and Tang, Eric and Thite, Anish and Wang, Ben and Wang, Kevin and Zou, Andy},
  title        = {A framework for few-shot language model evaluation},
  month        = sep,
  year         = 2021,
  publisher    = {Zenodo},
  version      = {v0.0.1},
  doi          = {10.5281/zenodo.5371628},
  url          = {https://doi.org/10.5281/zenodo.5371628},
}`,
    url: "https://doi.org/10.5281/zenodo.5371628",
  },
];

const priorWork = [
  {
    title: "Open LLM Leaderboard v1",
    authors:
      "Edward Beeching, Clémentine Fourrier, Nathan Habib, Sheon Han, Nathan Lambert, Nazneen Rajani, Omar Sanseviero, Lewis Tunstall, Thomas Wolf",
    citation: `@misc{open-llm-leaderboard-v1,
  author = {Edward Beeching and Clémentine Fourrier and Nathan Habib and Sheon Han and Nathan Lambert and Nazneen Rajani and Omar Sanseviero and Lewis Tunstall and Thomas Wolf},
  title = {Open LLM Leaderboard (2023-2024)},
  year = {2023},
  publisher = {Hugging Face},
  howpublished = "\\url{https://huggingface.co/spaces/open-llm-leaderboard-old/open_llm_leaderboard}"
}`,
    type: "main",
  },
];

const benchmarks = [
  {
    title: "IFEval: Instruction-Following Evaluation",
    authors: "Zhou et al.",
    citation: `@misc{zhou2023instructionfollowingevaluationlargelanguage,
  title={Instruction-Following Evaluation for Large Language Models},
  author={Jeffrey Zhou and Tianjian Lu and Swaroop Mishra and Siddhartha Brahma and Sujoy Basu and Yi Luan and Denny Zhou and Le Hou},
  year={2023},
  eprint={2311.07911},
  archivePrefix={arXiv},
  primaryClass={cs.CL},
  url={https://arxiv.org/abs/2311.07911},
}`,
    url: "https://arxiv.org/abs/2311.07911",
  },
  {
    title: "BBH: Big-Bench Hard",
    authors: "Suzgun et al.",
    citation: `@misc{suzgun2022challengingbigbenchtaskschainofthought,
  title={Challenging BIG-Bench Tasks and Whether Chain-of-Thought Can Solve Them},
  author={Mirac Suzgun and Nathan Scales and Nathanael Schärli and Sebastian Gehrmann and Yi Tay and Hyung Won Chung and Aakanksha Chowdhery and Quoc V. Le and Ed H. Chi and Denny Zhou and Jason Wei},
  year={2022},
  eprint={2210.09261},
  archivePrefix={arXiv},
  primaryClass={cs.CL},
  url={https://arxiv.org/abs/2210.09261},
}`,
    url: "https://arxiv.org/abs/2210.09261",
  },
  {
    title: "MATH: Mathematics Aptitude Test of Heuristics - Level 5",
    authors: "Hendrycks et al.",
    citation: `@misc{hendrycks2021measuringmathematicalproblemsolving,
  title={Measuring Mathematical Problem Solving With the MATH Dataset},
  author={Dan Hendrycks and Collin Burns and Saurav Kadavath and Akul Arora and Steven Basart and Eric Tang and Dawn Song and Jacob Steinhardt},
  year={2021},
  eprint={2103.03874},
  archivePrefix={arXiv},
  primaryClass={cs.LG},
  url={https://arxiv.org/abs/2103.03874},
}`,
    url: "https://arxiv.org/abs/2103.03874",
  },
  {
    title: "GPQA: Graduate-Level Google-Proof Q&A",
    authors: "Rein et al.",
    citation: `@misc{rein2023gpqagraduatelevelgoogleproofqa,
  title={GPQA: A Graduate-Level Google-Proof Q&A Benchmark},
  author={David Rein and Betty Li Hou and Asa Cooper Stickland and Jackson Petty and Richard Yuanzhe Pang and Julien Dirani and Julian Michael and Samuel R. Bowman},
  year={2023},
  eprint={2311.12022},
  archivePrefix={arXiv},
  primaryClass={cs.AI},
  url={https://arxiv.org/abs/2311.12022},
}`,
    url: "https://arxiv.org/abs/2311.12022",
  },
  {
    title: "MuSR: Multistep Soft Reasoning",
    authors: "Sprague et al.",
    citation: `@misc{sprague2024musrtestinglimitschainofthought,
  title={MuSR: Testing the Limits of Chain-of-thought with Multistep Soft Reasoning},
  author={Zayne Sprague and Xi Ye and Kaj Bostrom and Swarat Chaudhuri and Greg Durrett},
  year={2024},
  eprint={2310.16049},
  archivePrefix={arXiv},
  primaryClass={cs.CL},
  url={https://arxiv.org/abs/2310.16049},
}`,
    url: "https://arxiv.org/abs/2310.16049",
  },
  {
    title: "MMLU-Pro: Massive Multitask Language Understanding Professional",
    authors: "Wang et al.",
    citation: `@misc{wang2024mmluprorobustchallengingmultitask,
  title={MMLU-Pro: A More Robust and Challenging Multi-Task Language Understanding Benchmark},
  author={Yubo Wang and Xueguang Ma and Ge Zhang and Yuansheng Ni and Abhranil Chandra and Shiguang Guo and Weiming Ren and Aaran Arulraj and Xuan He and Ziyan Jiang and Tianle Li and Max Ku and Kai Wang and Alex Zhuang and Rongqi Fan and Xiang Yue and Wenhu Chen},
  year={2024},
  eprint={2406.01574},
  archivePrefix={arXiv},
  primaryClass={cs.CL},
  url={https://arxiv.org/abs/2406.01574},
}`,
    url: "https://arxiv.org/abs/2406.01574",
  },
];

const CitationBlock = ({ citation, title, authors, url, type }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(citation);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: "1px solid",
        borderColor: "grey.200",
        backgroundColor: "transparent",
        borderRadius: 2,
        position: "relative",
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {authors}
        </Typography>
        {url && (
          <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ fontSize: "0.875rem", display: "block", mt: 0.5 }}
          >
            View paper →
          </Link>
        )}
      </Box>
      <Box
        sx={{
          backgroundColor: "grey.900",
          borderRadius: 1,
          p: 2,
          position: "relative",
        }}
      >
        <Tooltip title="Copy citation" placement="top">
          <IconButton
            onClick={handleCopy}
            size="small"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "grey.500",
              "&:hover": {
                color: "grey.300",
              },
            }}
          >
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Box
          component="pre"
          sx={{
            margin: 0,
            color: "#fff",
            fontSize: "0.875rem",
            fontFamily: "monospace",
            whiteSpace: "pre",
            textAlign: "left",
            overflow: "auto",
          }}
        >
          <code>{citation}</code>
        </Box>
      </Box>
    </Paper>
  );
};

function QuotePage() {
  return (
    <Box sx={{ width: "100%", maxWidth: 1200, margin: "0 auto", padding: 4 }}>
      <PageHeader
        title="Citation Information"
        subtitle="How to cite the Open LLM Leaderboard in your work"
      />

      <Alert severity="info" sx={{ mb: 4 }}>
        <Typography variant="body2">
          The citations below include both the leaderboard itself and the
          individual benchmarks used in our evaluation suite.
        </Typography>
      </Alert>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Leaderboard
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {citations.map((citation, index) => (
            <CitationBlock key={index} {...citation} />
          ))}
        </Box>
      </Box>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Benchmarks
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {benchmarks.map((benchmark, index) => (
            <CitationBlock key={index} {...benchmark} />
          ))}
        </Box>
      </Box>

      <Box>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Prior Work
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {priorWork.map((citation, index) => (
            <CitationBlock key={index} {...citation} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default QuotePage;
