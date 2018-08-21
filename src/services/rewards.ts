import { ConsensusResponse, ConsensusAgentNode } from '../model/consensus';
import { Block } from '../model/blocks';
import { balanceNumber } from '../model/common';

export function calculateStakingRewardsPerRound(node: ConsensusAgentNode, blocks: Block[], consensusList: ConsensusResponse[]): balanceNumber {

  const perBlockRewardList: balanceNumber[] = consensusList
    .map((consensus: ConsensusResponse) => {

      let perBlockReward: balanceNumber = -1;

      // tslint:disable-next-line:max-line-length
      const agentNode: ConsensusAgentNode | undefined = consensus.consensus.agents.find((agent: ConsensusAgentNode) => agent.agentHash === node.agentHash);

      if (agentNode) {

        const stakedAmount: balanceNumber = agentNode.totalDeposit; // (agentNode.deposit + agentNode.totalDeposit);
        const blockByHeight: Block | undefined = blocks.find((block: Block) => block.height === consensus.consensus.height);

        if (blockByHeight) {

          const blockRewards: balanceNumber = blockByHeight.reward;
          perBlockReward = blockRewards / stakedAmount;

        }

      }

      return perBlockReward;

    })
    .filter((perBlockReward: balanceNumber) => perBlockReward !== -1);

  return perBlockRewardList.length > 0
    ? perBlockRewardList.reduce((prev: balanceNumber, curr: balanceNumber) => prev + curr, 0) / perBlockRewardList.length
    : 0;

}
