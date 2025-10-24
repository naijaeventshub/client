import { useState, useCallback } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';

/**
 * GraphQL Mutations for facial verification
 */
const ENROLL_FACE_MUTATION = gql`
  mutation EnrollFace($input: EnrollFaceInput!) {
    enrollFace(input: $input) {
      success
      faceId
      error
    }
  }
`;

const VERIFY_FACE_MUTATION = gql`
  mutation VerifyFace($input: VerifyFaceInput!) {
    verifyFace(input: $input) {
      isVerified
      confidence
      matchScore
      error
    }
  }
`;

const GET_PROVIDERS_QUERY = gql`
  query GetFacialVerificationProviders {
    facialVerificationProviders {
      name
      healthy
    }
  }
`;

const GET_CURRENT_PROVIDER_QUERY = gql`
  query GetCurrentFacialVerificationProvider {
    currentFacialVerificationProvider
  }
`;

const SWITCH_PROVIDER_MUTATION = gql`
  mutation SwitchFacialVerificationProvider($providerName: String!) {
    switchFacialVerificationProvider(providerName: $providerName)
  }
`;

export interface EnrollFaceResult {
  success: boolean;
  faceId?: string;
  error?: string;
}

export interface VerifyFaceResult {
  isVerified: boolean;
  confidence: number;
  matchScore?: number;
  error?: string;
}

export interface FacialVerificationProvider {
  name: string;
  healthy: boolean;
}

export interface UseFacialVerificationReturn {
  // Enrollment
  enrollFace: (
    imageBuffer: string,
    providerName?: string,
    photoidImageBuffer?: string
  ) => Promise<EnrollFaceResult>;
  isEnrolling: boolean;
  enrollError?: Error;

  // Verification
  verifyFace: (
    imageBuffer: string,
    providerName?: string,
    photoidImageBuffer?: string
  ) => Promise<VerifyFaceResult>;
  isVerifying: boolean;
  verifyError?: Error;

  // Provider management
  providers: FacialVerificationProvider[];
  currentProvider: string | null;
  isLoadingProviders: boolean;
  isLoadingCurrentProvider: boolean;
  switchProvider: (providerName: string) => Promise<string>;
  isSwitchingProvider: boolean;
}

/**
 * Hook for facial verification operations
 * Provides enrollment, verification, and provider management
 * @returns UseFacialVerificationReturn
 */
export function useFacialVerification(): UseFacialVerificationReturn {
  const [enrollError, setEnrollError] = useState<Error>();
  const [verifyError, setVerifyError] = useState<Error>();

  // Mutations
  const [enrollFaceMutation, { loading: isEnrolling }] =
    useMutation(ENROLL_FACE_MUTATION);
  const [verifyFaceMutation, { loading: isVerifying }] =
    useMutation(VERIFY_FACE_MUTATION);
  const [switchProviderMutation, { loading: isSwitchingProvider }] =
    useMutation(SWITCH_PROVIDER_MUTATION);

  // Queries
  const { data: providersData, loading: isLoadingProviders } =
    useQuery(GET_PROVIDERS_QUERY);
  const { data: currentProviderData, loading: isLoadingCurrentProvider } =
    useQuery(GET_CURRENT_PROVIDER_QUERY);

  const handleEnrollFace = useCallback(
    async (
      imageBuffer: string,
      providerName?: string,
      photoidImageBuffer?: string
    ): Promise<EnrollFaceResult> => {
      try {
        setEnrollError(undefined);
        const { data } = await enrollFaceMutation({
          variables: {
            input: {
              imageBuffer,
              providerName,
              photoidImageBuffer,
            },
          },
        });

        const result = (data as { enrollFace?: EnrollFaceResult })?.enrollFace;
        if (result?.error) {
          throw new Error(result.error);
        }

        return result || { success: false };
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error');
        setEnrollError(err);
        throw err;
      }
    },
    [enrollFaceMutation]
  );

  const handleVerifyFace = useCallback(
    async (
      imageBuffer: string,
      providerName?: string,
      photoidImageBuffer?: string
    ): Promise<VerifyFaceResult> => {
      try {
        setVerifyError(undefined);
        const { data } = await verifyFaceMutation({
          variables: {
            input: {
              imageBuffer,
              providerName,
              photoidImageBuffer,
            },
          },
        });

        const result = (data as { verifyFace?: VerifyFaceResult })?.verifyFace;
        if (result?.error) {
          throw new Error(result.error);
        }

        return result || { isVerified: false, confidence: 0 };
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error');
        setVerifyError(err);
        throw err;
      }
    },
    [verifyFaceMutation]
  );

  const handleSwitchProvider = useCallback(
    async (providerName: string): Promise<string> => {
      try {
        const { data } = await switchProviderMutation({
          variables: {
            providerName,
          },
        });

        return (
          (data as { switchFacialVerificationProvider?: string })
            ?.switchFacialVerificationProvider || ''
        );
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error');
        throw err;
      }
    },
    [switchProviderMutation]
  );

  return {
    enrollFace: handleEnrollFace,
    isEnrolling,
    enrollError,

    verifyFace: handleVerifyFace,
    isVerifying,
    verifyError,

    providers:
      (
        providersData as {
          facialVerificationProviders?: FacialVerificationProvider[];
        }
      )?.facialVerificationProviders || [],
    currentProvider:
      (currentProviderData as { currentFacialVerificationProvider?: string })
        ?.currentFacialVerificationProvider || null,
    isLoadingProviders,
    isLoadingCurrentProvider,
    switchProvider: handleSwitchProvider,
    isSwitchingProvider,
  };
}
